import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CardSetCollectionDTO } from 'src/app/classes/CardSetCollectionDTO';
import { UserSetCollectionDTO } from 'src/app/classes/UserSetCollectionDTO';
import { SpinnerService } from 'src/app/service/spinner.service';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { SuccessDialogComponent } from '../dialogs/success-dialog/success-dialog.component';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { TransferService } from './transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
    // Encapsulation has to be disabled in order for the
  // component style to apply to the select panel.

})
export class TransferComponent implements OnInit {

  constructor(private service: TransferService, private dialog: MatDialog, private spinner: SpinnerService, private toastr: ToastrService) { }

  topTp;
  leftTp;
  imgTooltip: string;
  isShowTooltip: boolean = false;
  isVisible = false;

  showLeftDetails = false;
  showRightDetails = false;

  rightSets: any[] = [];
  leftSets: any[] = [];



  leftUserSetCollecton: UserSetCollectionDTO; 
  rightUserSetCollection: UserSetCollectionDTO;

  ngOnInit() {
  }


  searchSets(setType:string, side:string){
    this.spinner.show()
    if(setType == 'Deck'){
      this.service.getDecksNames().subscribe(names => {
        if(side == 'R')
          this.rightSets = names;     
        else
          this.leftSets = names;

          this.spinner.hide();
      }, error => {  this.spinner.hide();})
    } else {
      this.service.getSetCollectionNames(setType).subscribe(names => {
          if(side == 'R')
          this.rightSets = names;
        else
          this.leftSets = names;

          this.spinner.hide();
      }, error => {  this.spinner.hide();})
    }  
  }

  getSetAndCards(side:string, setType:string, id:number){
    if(this.isSetChoosenValid(id, side, setType)){
      let setId = Number(id);
      if(setType == 'Deck'){
        this.getDeckAndCardsForTransfer(side, setId, setType);
      } else {
        this.getSetCollectionForTransfer(side, setId, setType);
      }
    }   
  }

  getDeckAndCardsForTransfer(side:string, deckId:number, setType:string){
      this.spinner.show()
    this.service.getDeckAndCardsForTransfer(deckId).subscribe(data => {
      if(side == 'L'){
        this.leftUserSetCollecton = data;
        this.leftUserSetCollecton.setType = setType
      } else {
        this.rightUserSetCollection = data;
        this.rightUserSetCollection.setType = setType
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.errorDialog("Sorry, something wrong happened! Try again later");
      console.log(error);
    })
  }

  getSetCollectionForTransfer(side:string, deckId:number, setType:string){
    
    this.spinner.show()
    this.service.getSetCollectionForTransfer(deckId).subscribe(data => {
      if(side == 'L'){
        this.leftUserSetCollecton = data;
        this.leftUserSetCollecton.setType = setType
        this.countRarities(this.leftUserSetCollecton)
      } else {
        this.rightUserSetCollection = data;
        this.rightUserSetCollection.setType = setType
        this.countRarities(this.rightUserSetCollection)
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.errorDialog("Sorry, something wrong happened! Try again later");
      console.log(error);
    })
}

  isSetChoosenValid(setId:number, side:string, setType: string):boolean {
      if(this.rightUserSetCollection == undefined && this.leftUserSetCollecton == undefined){
        return true;
      } else if (
        (this.rightUserSetCollection == undefined || this.rightUserSetCollection.id != setId) && 
        (this.leftUserSetCollecton == undefined || this.leftUserSetCollecton.id != setId)) {
                    return true;
       } else {
        this.errorDialog("This set has already been choose!");
        return false;
      }
  }

  transferCardToOtherSide(side:string, cardSetCode:string){
    
    let card: CardSetCollectionDTO = side == 'R' ? this.getCardBySide(this.rightUserSetCollection, cardSetCode) : this.getCardBySide(this.leftUserSetCollecton, cardSetCode);
    if((side == 'R' && this.leftUserSetCollecton == undefined) || (side == 'L') && this.rightUserSetCollection == undefined){
      this.errorDialog("First, choose the Set of other side");
      return;
    }

    if(side == 'R')    
      this.transferCardToLeft(card)
    else
      this.transferCardToRight(card);
  }

  countRarities(userSet: UserSetCollectionDTO){
    
    userSet.rarities.Secret_Rare = userSet.cards.filter(c => c.relDeckCards.card_raridade == 'Secret Rare').length 
    userSet.rarities.Ultra_Rare = userSet.cards.filter(c => c.relDeckCards.card_raridade == 'Ultra Rare').length
    userSet.rarities.Super_Rare = userSet.cards.filter(c => c.relDeckCards.card_raridade == 'Super Rare').length
    userSet.rarities.Rare = userSet.cards.filter(c => c.relDeckCards.card_raridade == 'Rare').length
    userSet.rarities.Common = userSet.cards.filter(c => c.relDeckCards.card_raridade == 'Common').length
 
  }

  private validQtdCardsDeck(userSet: UserSetCollectionDTO, cardId:number){
    if(userSet.setType == 'Deck'){
      let qtd = userSet.cards.filter(c => c.cardId == cardId).length;
      if(qtd == 3){
        this.toastr.warning("There are already 3 of this Card in Deck");
        return false;
      } 
      return true;
    } else {
      return true
    }
  }

  private spliceOrSubtractCard(userSet: UserSetCollectionDTO, card:CardSetCollectionDTO){
      let qtdRight = card.quantityUserHave; 
      if(userSet.setType == 'Deck'){
         let index:number = userSet.cards.findIndex(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code);
        userSet.cards.splice(index, 1);      
      } else {
        userSet.cards.filter(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code).forEach(cardFiltered => {
          cardFiltered.quantityUserHave --;
          if(cardFiltered.quantityUserHave == 0){
            userSet.cards.splice(userSet.cards.findIndex(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code), 1); 
          }
        })
      
      }

  }

  private tranferCardAndCalculate(userSet:UserSetCollectionDTO, card: CardSetCollectionDTO){

    let transferableCard:CardSetCollectionDTO[] = userSet.cards.filter(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code);

      if(transferableCard != null && transferableCard != undefined && transferableCard.length > 0 && userSet.setType != 'Deck'){
        transferableCard[0].quantityUserHave ++;
      } else {
       let newCard = Object.assign({}, card);
       newCard.angularId = Date.now()
       newCard.quantityUserHave = 1;
       userSet.cards.unshift(newCard);
       //this.leftUserSetCollecton.cards.filter(c => c.angularId == )
      }
  }

  transferCardToLeft(card: CardSetCollectionDTO){
    if(!this.validQtdCardsDeck(this.leftUserSetCollecton, card.cardId))
      return false;

      this.spliceOrSubtractCard(this.rightUserSetCollection, card);
      this.tranferCardAndCalculate(this.leftUserSetCollecton, card);
   
      let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
      let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);
      
      this.leftUserSetCollecton.totalPrice = ((card.relDeckCards.card_price + leftTotalPrice).toFixed(2)).toString();
      this.rightUserSetCollection.totalPrice = ((rightTotalPrice - card.relDeckCards.card_price).toFixed(2)).toString();

      this.countRarities(this.leftUserSetCollecton)
      this.countRarities(this.rightUserSetCollection)

  }

  transferCardToRight(card: CardSetCollectionDTO){

    if(!this.validQtdCardsDeck(this.rightUserSetCollection, card.cardId))
      return false;

    this.spliceOrSubtractCard(this.leftUserSetCollecton, card);
  
    this.tranferCardAndCalculate(this.rightUserSetCollection, card);

    let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
    let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);
    
    this.leftUserSetCollecton.totalPrice =   ((leftTotalPrice - card.relDeckCards.card_price).toFixed(2)).toString();
    this.rightUserSetCollection.totalPrice = ((rightTotalPrice + card.relDeckCards.card_price).toFixed(2)).toString();

    this.countRarities(this.leftUserSetCollecton)
    this.countRarities(this.rightUserSetCollection)
  }

  getCardBySide(deck:UserSetCollectionDTO, setCode:string):CardSetCollectionDTO {
      let card = deck.cards.filter(c => c.relDeckCards.card_set_code == setCode)[0];
      return card;
  }

  saveSets(){
      this.spinner.show();
      let setsToBeSaved: UserSetCollectionDTO[] = new Array();
      debugger
      setsToBeSaved.push(this.rightUserSetCollection);
      setsToBeSaved.push(this.leftUserSetCollecton);

    this.service.saveSets(setsToBeSaved).subscribe(result => {
      let msg = result;
      this.spinner.hide();
      this.successDialog(msg);

    }, error => {
      this.spinner.hide()
      this.errorDialog("Sorry, something bad happened! Try again later");
      console.log(error);
    })
  }

  cardImagem(cardId: any){
    let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/'+cardId+'.jpg';
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

storedCardId(cardNumber:any){
  
  localStorage.setItem("idCard", cardNumber);
}

}
