import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox, MatDialog, MatSelect } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/classes/Card';
import { CardSetCollectionDTO } from 'src/app/classes/CardSetCollectionDTO';
import { RelDeckCards } from 'src/app/classes/Rel_Deck_Cards';
import { UserSetCollectionDTO } from 'src/app/classes/UserSetCollectionDTO';
import { CardServiceService } from 'src/app/service/card-service/card-service.service';
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

  
  constructor(private service: UserSetCollectionService, private spinner: SpinnerService, private dialog: MatDialog,
     private toast: ToastrService, private cardService: CardServiceService, private ElByClassName: ElementRef ) {}

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
  filterOnlyCardsUserHave(event:any, haveOrNot:string){
    let userHave = haveOrNot === 'have' ? true : false;

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
          if(card.relDeckCards.cardSetCode.includes(setCode))
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
        return a.relDeckCards.card_price - b.relDeckCards.card_price
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

  // addOrRemoveCard(cardSetCode: string, operation:string){  
  //   debugger
  //  let totalPrice = parseFloat(this.userSetCollecton.totalPrice)
  //     this.originalCollection.forEach(card =>{
  //       if(card.relDeckCards.card_set_code == cardSetCode && operation == 'plus'){
  //         card.quantityUserHave += 1;
  //         this.userSetCollecton.totalPrice = ((card.relDeckCards.card_price + totalPrice).toFixed(2)).toString();
  //       } else if(card.relDeckCards.card_set_code == cardSetCode && operation == 'minus' && card.quantityUserHave > 0){
  //         card.quantityUserHave -= 1;
  //         this.userSetCollecton.totalPrice = ((totalPrice - card.relDeckCards.card_price).toFixed(2)).toString();
  //       }
  //     });
  // }

  addOrRemoveCard(card: CardSetCollectionDTO, operation:string){  
    
   let totalPrice = parseFloat(this.userSetCollecton.totalPrice);
   
    this.originalCollection.filter(c1 => c1.relDeckCards.card_set_code == card.relDeckCards.card_set_code).forEach(cardFiltered => {
      if(operation == 'plus'){
        cardFiltered.quantityUserHave += 1;
        this.userSetCollecton.totalPrice = ((cardFiltered.relDeckCards.card_price + totalPrice).toFixed(2)).toString();
      } else if(operation == 'minus' && card.quantityUserHave > 0){
        cardFiltered.quantityUserHave -= 1;
        this.userSetCollecton.totalPrice = ((totalPrice - cardFiltered.relDeckCards.card_price).toFixed(2)).toString();
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
    if(result.data != null && result.data != undefined && result.data.content.length > 0){
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

  addToCollection(card:Card){
    
    let newcard:CardSetCollectionDTO = new CardSetCollectionDTO();
    let rel: RelDeckCards = new RelDeckCards();

    newcard.angularId = Date.now();
    newcard.cardId = card.id;
    newcard.name = card.nome
    newcard.number = card.numero
    newcard.quantityOtherCollections = 0;
    newcard.quantityUserHave = 0;
    newcard.searchedRelDeckCards = [];

    rel.card_raridade = "Not Defined";
    rel.card_set_code = "";
    rel.card_price = 0

    newcard.relDeckCards = rel;
    
    this.originalCollection.unshift(newcard);
  }


  storedCardId(cardNumber){    
    localStorage.setItem("idCard", cardNumber);
  }

  consultCardSetCode(card){
    
    if(card.cardId == null || card.cardId == undefined){
      this.errorDialog("Sorry, can't consult card's set codes.");
      return false;
    }
    
    if(card.searchedRelDeckCards.length == 0){
  
      this.cardService.findAllRelDeckCardsByCardNumber(card.cardId).subscribe(data => { 
        this.spinner.show();     
        let relationArray: RelDeckCards[] = data;
        card.listSetCode = [];
        relationArray.forEach(rel => {
          card.listSetCode.push(rel.card_set_code);
        });
        card.searchedRelDeckCards = relationArray;
        this.spinner.hide();
      },
      error =>{
        this.spinner.hide();
        console.log(error.body)
        this.errorDialog("ERROR: Something wrong happened, try again later.")
      });
    } 
   
  }

  setRelInfo(card:CardSetCollectionDTO, setCode: string){
    debugger
    card.angularId = Date.now();

    this.originalCollection.filter(c => c.angularId == card.angularId).forEach(c => {
      debugger
        let rel:RelDeckCards = c.searchedRelDeckCards.filter(r => r.card_set_code === setCode)[0];

        if(rel != null && rel != undefined && setCode != "undefined"){
            c.relDeckCards.card_price = rel.card_price;
            c.relDeckCards.card_raridade = rel.card_raridade;
            c.relDeckCards.card_set_code = rel.card_set_code;
        } else if (setCode == "undefined"){
            c.relDeckCards.card_price = 0
            c.relDeckCards.card_raridade = "Not Defined"
            c.relDeckCards.card_set_code = "";
        }
    })

    console.log(this.originalCollection)
    
  }

  saveSetCollection(){

    this.spinner.show();
    this.userSetCollecton.cards = [];
    debugger
    //this.userSetCollecton.cards = this.originalCollection.filter(card => card.quantityUserHave > 0);

    for(let i = 0; i < this.originalCollection.length; i++ ){
      if(this.originalCollection[i].quantityUserHave > 0){
        const allSelectsCards = (<HTMLElement>this.ElByClassName.nativeElement).querySelectorAll('.form-select option:checked')[i].innerHTML;
        if(this.originalCollection[i].relDeckCards.card_set_code != allSelectsCards){
          let setCode = allSelectsCards == "Set Code..." ? "Not Defined" : allSelectsCards;
          this.originalCollection[i].relDeckCards.card_set_code = setCode;
        }         
        this.userSetCollecton.cards.push(this.originalCollection[i]);
      }
    }
    console.log(this.userSetCollecton.cards)
    this.service.saveSetCollection(this.userSetCollecton).subscribe(data => {
      this.userSetCollecton.cards = this.originalCollection;
      this.successDialog("Set Collection was successfully saved!");
    }, error => {
      console.log(error);
      this.errorDialog("Sorry, It was not possible save Collection, try again later!");
    })
  }
}
