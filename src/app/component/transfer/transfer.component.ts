import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
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

  constructor(private service: TransferService, private dialog: MatDialog, private spinner: SpinnerService) { }

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
        }
      }   
  }

  getDeckAndCardsForTransfer(side:string, deckId:number, setType:string){
      this.spinner.show()
    this.service.getDeckAndCardsForTransfer(deckId).subscribe(data => {
      console.log(data)
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
    debugger
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

  transferCardToLeft(card: CardSetCollectionDTO){
    let qtdRight = card.quantityUserHave;
    debugger 
        this.rightUserSetCollection.cards.forEach((c,i) => {
            if(c.relDeckCards.card_set_code == card.relDeckCards.card_set_code){
              if(qtdRight == 1)
                this.rightUserSetCollection.cards.splice(i, 1);
              else
                c.quantityUserHave --;
            }
        });

      let rightCard:CardSetCollectionDTO[] = this.leftUserSetCollecton.cards.filter(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code);

      if(rightCard != null && rightCard != undefined && rightCard.length > 0){
        rightCard[0].quantityUserHave ++;
      } else {
        this.leftUserSetCollecton.cards.unshift(card);
      }

      
   let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
   let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);
   
   this.leftUserSetCollecton.totalPrice = ((card.relDeckCards.card_price + leftTotalPrice).toFixed(2)).toString();
   this.rightUserSetCollection.totalPrice = ((rightTotalPrice - card.relDeckCards.card_price).toFixed(2)).toString();

  }

  transferCardToRight(card: CardSetCollectionDTO){
    let qtdLeft = card.quantityUserHave;
    debugger

        this.leftUserSetCollecton.cards.forEach((c,i) => {
            if(c.relDeckCards.card_set_code == card.relDeckCards.card_set_code){
              if(qtdLeft == 1)
                this.leftUserSetCollecton.cards.splice(i, 1);
              else
                c.quantityUserHave --;
            }
        });
        let rightCard:CardSetCollectionDTO[] = this.rightUserSetCollection.cards.filter(c => c.relDeckCards.card_set_code == card.relDeckCards.card_set_code);

        if(rightCard != null && rightCard != undefined && rightCard.length > 0){
          rightCard[0].quantityUserHave ++;
        } else {
          this.rightUserSetCollection.cards.unshift(card);
        }

    let leftTotalPrice = parseFloat(this.leftUserSetCollecton.totalPrice);
   let rightTotalPrice = parseFloat(this.rightUserSetCollection.totalPrice);
   
   this.leftUserSetCollecton.totalPrice =   ((leftTotalPrice - card.relDeckCards.card_price).toFixed(2)).toString();
   this.rightUserSetCollection.totalPrice = ((rightTotalPrice + card.relDeckCards.card_price).toFixed(2)).toString();
  }

  getCardBySide(deck:UserSetCollectionDTO, setCode:string):CardSetCollectionDTO {
      let card = deck.cards.filter(c => c.relDeckCards.card_set_code == setCode)[0];
      return card;
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

}
