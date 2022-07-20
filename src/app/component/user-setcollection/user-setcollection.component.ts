import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CardSetCollectionDTO } from 'src/app/classes/CardSetCollectionDTO';
import { UserSetCollectionDTO } from 'src/app/classes/UserSetCollectionDTO';
import { SpinnerService } from 'src/app/service/spinner.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../dialogs/success-dialog/success-dialog.component';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { UserSetCollectionService } from './user-setcollection.service';

@Component({
  selector: 'app-user-setcollection',
  templateUrl: './user-setcollection.component.html',
  styleUrls: ['./user-setcollection.component.css']
})
export class UserSetcollectionComponent implements OnInit {

  constructor(private service: UserSetCollectionService, private spinner: SpinnerService, private dialog: MatDialog  ) {}


  userSetCollecton: UserSetCollectionDTO; 
  originalCollection: Array<CardSetCollectionDTO>; 
  onlyUserHaveCollection: CardSetCollectionDTO[];
  filteredCollection: CardSetCollectionDTO[] = [];

  isVisible: boolean = true;
  showDetail = true;
  

  ngOnInit() {
    this.getSetCollection();
  }

  getSetCollection(){
    this.spinner.show();
    const id = localStorage.getItem("idDeckDetails");
    this.service.getSetCollection(id).subscribe(data => {
      this.userSetCollecton = data;
      console.log(this.userSetCollecton)

    }, error => {
      this.spinner.hide();
      console.log(error);
      this.errorDialog("It was not possible load this Set Collection, try again later!")
    })
  }

  keyPressQuantityCard(event){
    var charCode =  event.keyCode;

    if((charCode < 48 || charCode > 57)){
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  //Checkbox Methods
  onlyCardsUserHave(event:any, haveOrNot:string){
    let userHave = haveOrNot === 'have' ? true : false;

    if(event === true){
      this.originalCollection = this.userSetCollecton.cards;
      this.userSetCollecton.cards = [];

      this.originalCollection.forEach(card => {
          if(userHave){
            if(card.quantityUserHave > 0){
              this.filteredCollection.push(card);
            }
          } else {
            if(card.quantityUserHave === 0){
              this.filteredCollection.push(card);
            }
          }        
      });

      this.userSetCollecton.cards = this.filteredCollection;
    } else {
      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = this.originalCollection;
      this.filteredCollection = [];
    }
    
  }

  showDetails(event:any){
    if(event)
      this.isVisible = true;
    else
      this.isVisible = false;
  }


  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  errorDialog(errorMessage:string){
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    })
  }
  
  warningDialog(warningMessage:string){
    this.dialog.open(WarningDialogComponent, {
      data: warningMessage
    })
  }
  
  successDialog(successMessage:string){
    this.dialog.open(SuccessDialogComponent,{
      data: successMessage
    })
  }

}
