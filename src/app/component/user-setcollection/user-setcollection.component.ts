import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatCheckbox, MatDialog, MatDialogRef, MatSelect } from '@angular/material';
import { Route, Router } from '@angular/router';
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
import { InfoDialogComponent } from '../dialogs/info-dialog/info-dialog/info-dialog.component';
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
  @ViewChild("nameInput",{static: true}) nameInput : ElementRef;
  @ViewChild('callAPIDialog',{static: true}) callAPIDialog: TemplateRef<any>;
  private dialogRef: MatDialogRef<TemplateRef<any>>;

  
  constructor(private service: UserSetCollectionService, private spinner: SpinnerService, private dialog: MatDialog,
     private toast: ToastrService, private cardService: CardServiceService, private route: Router ) {}

  userSetCollecton: UserSetCollectionDTO; 
  originalCollection: Array<CardSetCollectionDTO> = []
  onlyUserHaveCollection: CardSetCollectionDTO[];
  filteredCollection: CardSetCollectionDTO[] = [];
  basedDecks: any[] = [];

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

  newSetCollection(){
    this.infoDialog('Create your new Collection!');
    this.userSetCollecton = new UserSetCollectionDTO();
    this.userSetCollecton.cards = new Array();
    this.userSetCollecton.id = 0;
    this.userSetCollecton.name = "";
    this.userSetCollecton.totalPrice = "0";
    let arr = this.userSetCollecton.cards.slice(0);
    this.originalCollection = arr;
    this.spinner.hide();
  }
  getSetCollection(){
    this.spinner.show();
    const id = localStorage.getItem("idDeckDetails");
    
    if(id == "0"){
      this.newSetCollection();
      return false;
     }

    this.service.getSetCollection(id).subscribe(data => {
      this.userSetCollecton = data;
      this.setBasedDeck(data['basedDeck'])
      let arr = this.userSetCollecton.cards.slice(0);
      this.originalCollection = arr;
      console.log(this.userSetCollecton)

    }, error => {
      this.spinner.hide();
      console.log(error);
      this.errorDialog("It was not possible load this Set Collection, try again later!")
    })
  }

  putAngularId(arr:CardSetCollectionDTO[]){
    for(let i = 0; i < this.originalCollection.length; i++){
      arr[i].angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
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

  filterByRarity(){
      let filteredArray = new Array();

      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Secret Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Ultra Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Super Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Rare').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Common').forEach(card => { filteredArray.push(card)});
      this.userSetCollecton.cards.filter(c => c.relDeckCards.card_raridade == 'Not Defined').forEach(card => { filteredArray.push(card)});

      this.userSetCollecton.cards = [];
      this.userSetCollecton.cards = filteredArray;
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
    else if(filter == 2)
        this.filterByMostAdded();
    else if(filter == 3)
        this.filterByPrice();
    else if(filter == 4)
        this.filterByRarity();  
   else if( filter == 5)
        this.filterByAZSetCode(); 
     
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

  filterByAZSetCode(){
    var sortedArray: CardSetCollectionDTO[] = this.userSetCollecton.cards.slice(0);
    sortedArray.sort((n1,n2) => {
      if (n1.relDeckCards.card_set_code > n2.relDeckCards.card_set_code) {
          return 1;
      }
  
      if (n1.relDeckCards.card_set_code < n2.relDeckCards.card_set_code) {
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
        } else if (card.relDeckCards.card_set_code.toLowerCase().includes(value)){
          this.userSetCollecton.cards.push(card)
        }
      })
    } else {
        if(this.userSetCollecton.cards.length < this.originalCollection.length)
          this.userSetCollecton.cards = this.originalCollection;
    }
  }
  addOrRemoveCard(card: CardSetCollectionDTO, operation:string){  
     
   let totalPrice = parseFloat(this.userSetCollecton.totalPrice);
    card.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    this.originalCollection.filter(c1 => c1.angularId == card.angularId).forEach(cardFiltered => {
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
  
  infoDialog(infoMessage:string){
    this.dialog.open(InfoDialogComponent, {
      data: infoMessage
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
  this.spinner.show();
  dialogRef.afterClosed().subscribe(result => {
    if(result.data != null && result.data != undefined && result.data.content.length > 0){
     // console.log(result.data)
      this.cardsSearched = result.data.content;
    //  console.log(this.cardsSearched)
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
  this.spinner.hide()
}

  closeSearch(){
    this.cardsSearched = [];
  }

  addToCollection(card:Card){
      
    let newcard:CardSetCollectionDTO = new CardSetCollectionDTO();
    let rel: RelDeckCards = new RelDeckCards();

    newcard.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
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
    if(this.userSetCollecton.id > 0){
      this.originalCollection.unshift(newcard);
      console.log(this.originalCollection)
     this.userSetCollecton.cards = this.originalCollection;
    }
    else{
      this.userSetCollecton.cards.push(newcard);
      this.originalCollection = this.userSetCollecton.cards
    }
     

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
          if(!card.listSetCode.includes(rel.card_set_code))
              card.listSetCode.push(rel.card_set_code);
        });
        card.searchedRelDeckCards = relationArray;
        card.quantityOtherCollections = 0;

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
    card.angularId = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

    this.originalCollection.filter(c => c.angularId == card.angularId).forEach(c => {
        let rel:RelDeckCards = c.searchedRelDeckCards.filter(r => r.card_set_code === setCode)[0];

        if(rel != null && rel != undefined && setCode != "undefined"){
            c.relDeckCards.card_price = rel.card_price;
            c.relDeckCards.card_raridade = rel.card_raridade;
            c.relDeckCards.card_set_code = rel.card_set_code;
            c.quantityOtherCollections = card.quantityOtherCollections
        } else if (setCode == "undefined"){
            c.relDeckCards.card_price = 0
            c.relDeckCards.card_raridade = "Not Defined"
            c.relDeckCards.card_set_code = "";
            c.quantityOtherCollections = 0
        }
    })
    //console.log(this.originalCollection);   
  }


  saveSetCollection(){

    this.closeSearch();

    let collectionName = this.nameInput.nativeElement.value;

    if(collectionName == "" || collectionName == null){
      this.warningDialog("Please, fill the Collection's Name!");
      this.nameInput.nativeElement.focus();
      return false;
    }

    this.spinner.show();
    this.userSetCollecton.cards = [];
 
    this.setCardsToBeSaved()
      
    this.userSetCollecton.name = collectionName
      
      this.service.saveSetCollection(this.userSetCollecton).subscribe(data => {
        this.userSetCollecton.cards = this.originalCollection;
        this.spinner.hide();
        this.successDialog("Set Collection was successfully saved!");
      }, error => {
        this.spinner.hide()
        console.log(error);
        this.errorDialog("Sorry, It was not possible save Collection, try again later!");
      })
  }

  setRarityColor(rarity:string){
    return GeneralFunctions.colorRarity(rarity);
  }

  setCardsToBeSaved(){
      this.originalCollection.filter(coll => coll.quantityUserHave > 0).forEach(coll => {
          if(coll.relDeckCards.card_set_code.includes("Set Code"))
              coll.relDeckCards.card_set_code = "Not Defined"
          
           this.userSetCollecton.cards.push(coll);
      }) 
  }

  openDialog(){
    this.dialogRef = this.dialog.open(this.callAPIDialog);
  }

  closeDialog(){
    this.dialogRef.close();
  }
  
  setBasedDeck(basedDecks: any) {
    if(basedDecks != null || basedDecks != undefined){
      Object.entries(basedDecks).forEach(item => {
        this.basedDecks.push({
          "deckId": item[0],
          "deckName": item[1]
        });
      })

      console.log(this.basedDecks)
    }  
  }

  createBasedDeck(deckId:any){
    if(!deckId)
      return null

    this.service.createBasedDeck(Number(deckId)).subscribe(result => {
      this.closeDialog();
      this.successDialog("A Based Deck has been created!")
      localStorage.setItem("idDeckDetails", result);
      localStorage.setItem("source", "KONAMI");
      localStorage.setItem("set_type", "DECK");
      this.route.navigate(['/userdeck-details/', '']);

    }, error => {
      console.log(error);
    })

  }
  

}
