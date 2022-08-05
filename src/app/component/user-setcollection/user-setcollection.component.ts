import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox, MatDialog, MatSelect } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/classes/Card';
import { CardSetCollectionDTO } from 'src/app/classes/CardSetCollectionDTO';
import { UserSetCollectionDTO } from 'src/app/classes/UserSetCollectionDTO';
import { SpinnerService } from 'src/app/service/spinner.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { SearchBoxComponent } from '../cards-search/search-box/search-box.component';
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
  
  constructor(private service: UserSetCollectionService, private spinner: SpinnerService, private dialog: MatDialog, private toast: ToastrService  ) {}


  userSetCollecton: UserSetCollectionDTO; 
  originalCollection: Array<CardSetCollectionDTO> = []
  onlyUserHaveCollection: CardSetCollectionDTO[];
  filteredCollection: CardSetCollectionDTO[] = [];

  cardsSearched: Card[] = [];

  isVisible: boolean = true;
  showDetail = true;
  

  ngOnInit() {
    this.getSetCollection();
  }
  //SWIPER
  breakpoints = {
    320:{slidePerView: 1.6, spaceBetween: 20}
  };

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
      this.userSetCollecton.cards = [];
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
      var sortedArray: CardSetCollectionDTO[] = this.userSetCollecton.cards.slice(0);
      sortedArray.sort((n1,n2) => {
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


  searchInput: string;

  searchCard(e:any){
    
    let value = this.searchInput.toLowerCase();

    if(value.length > 1){
      this.userSetCollecton.cards = [];
      this.originalCollection.forEach(card => {     
        if(card.name.toLowerCase().includes(value)){
          this.userSetCollecton.cards.push(card);
        }
      })
    } else {
        if(this.userSetCollecton.cards.length < this.originalCollection.length)
          this.userSetCollecton.cards = this.originalCollection;
    }
  }

  addOrRemoveCard(cardSetCode: string, operation:string){  
   let totalPrice = parseFloat(this.userSetCollecton.totalPrice)
      this.originalCollection.forEach(card =>{
        if(card.cardSetCode == cardSetCode && operation == 'plus'){
          card.quantityUserHave += 1;
          this.userSetCollecton.totalPrice = ((card.price + totalPrice).toFixed(2)).toString();
        } else if(card.cardSetCode == cardSetCode && operation == 'minus' && card.quantityUserHave > 0){
          card.quantityUserHave -= 1;
          this.userSetCollecton.totalPrice = ((totalPrice - card.price).toFixed(2)).toString();
        }
      });
  }

  addPlusOneForall(){
    this.originalCollection.forEach(card => {
      card.quantityUserHave += 1;
    })

    this.toast.success("Plus 1 was added to all Cards!");
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
  
 criterias = new Array();
 openDialogSearch() {
  const dialogRef = this.dialog.open(SearchBoxComponent);
  
  dialogRef.afterClosed().subscribe(result => {
    this.spinner.show();
    if(result.data != null && result.data != undefined){
      console.log(result.data)
      this.cardsSearched = result.data.content;
      console.log(this.cardsSearched)
      let page = 0;
    }
    else{
      this.warningDialog("No Cards found in this consult")
    }
      this.criterias = result.criterias
      this.spinner.hide();
  }, error => {
    this.spinner.hide();
      this.toast.error("Sorry, something bad happened, try again later. ERROR " + error.status)
  });
}

closeSearch(){
  this.cardsSearched = [];
}

}
