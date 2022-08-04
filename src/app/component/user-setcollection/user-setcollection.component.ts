import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox, MatDialog, MatSelect } from '@angular/material';
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

  @ViewChild("IDontHave",{static: true}) elemento: MatCheckbox;
  @ViewChild("IHave",{static: true}) elementoHave: MatCheckbox;
  
  constructor(private service: UserSetCollectionService, private spinner: SpinnerService, private dialog: MatDialog  ) {}


  userSetCollecton: UserSetCollectionDTO; 
  originalCollection: Array<CardSetCollectionDTO> = []
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
      this.originalCollection = this.userSetCollecton.cards;
      console.log(this.userSetCollecton.cards)

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
  filterOnlyCardsUserHave(event:any, haveOrNot:string){
    let userHave = haveOrNot === 'have' ? true : false;
    debugger

    if(event === true){
      if(this.originalCollection.length == 0)
        this.originalCollection = this.userSetCollecton.cards;

      this.userSetCollecton.cards = [];
      this.filteredCollection = [];

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

  filterByCardSetCode(e:any){
    
    let setCode = e.value;

    this.elemento.checked = false;//.checked = false;
    this.elementoHave.checked = false;

    if(setCode == 0){
      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = this.originalCollection;
    }
       

    else {
      
      this.filteredCollection = [];

      this.originalCollection.forEach(card => {
          if(card.cardSetCode.includes(setCode))
            this.filteredCollection.push(card);
      });

      if(this.filteredCollection.length > 0)
        this.userSetCollecton.cards = this.filteredCollection;
    }   
  }

  filterCollection(e:any){
    
    let filter = e.value;

    if(filter == 0){
      this.userSetCollecton.cards = this.originalCollection;
      return;
    }

    if(filter == 1)
      this.filterByAZ();
    if(filter == 2)
      this.filterByMostAdded();
    if(filter == 3)
      this.filterByPrice();
     
  }
  filterByPrice() {
    var sortedArray = this.userSetCollecton.cards.slice(0);
    sortedArray.sort(function(a,b) {
        return a.price - b.price;
    });

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
    this.userSetCollecton.cards.reverse()
  }

  filterByMostAdded() {

    var sortedArray = this.userSetCollecton.cards.slice(0);
    sortedArray.sort(function(a,b) {
        return a.quantityUserHave - b.quantityUserHave;
    });

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
    this.userSetCollecton.cards.reverse()
  }

  filterByAZ(){
      var sortedArray: CardSetCollectionDTO[] = this.userSetCollecton.cards.sort((n1,n2) => {
        if (n1.name > n2.name) {
            return 1;
        }
    
        if (n1.name < n2.name) {
            return -1;
        }
    
        return 0;
    })

    this.userSetCollecton.cards = [];
    this.userSetCollecton.cards = sortedArray;
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
