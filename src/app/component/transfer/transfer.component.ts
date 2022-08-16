import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { UserSetCollectionDTO } from 'src/app/classes/UserSetCollectionDTO';
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
  encapsulation: ViewEncapsulation.None,
})
export class TransferComponent implements OnInit {

  constructor(private service: TransferService, private dialog: MatDialog) { }

  topTp;
  leftTp;
  imgTooltip: string;
  isShowTooltip: boolean = false;
  isVisible = false;

  rightSets: any[] = [];
  leftSets: any[] = [];



  leftUserSetCollecton: UserSetCollectionDTO; 
  rightUserSetCollection: UserSetCollectionDTO;

  ngOnInit() {
  }


  searchSets(setType:string, side:string){
    
    if(setType == 'Deck'){
      this.service.getDecksNames().subscribe(names => {
        if(side == 'R')
          this.rightSets = names;     
        else
          this.leftSets = names;
      })
    } else {
      this.service.getSetCollectionNames(setType).subscribe(names => {
          if(side == 'R')
          this.rightSets = names;
        else
          this.leftSets = names;
      })
    }  
  }

  getSetAndCards(side:string, setType:string, id:number){
    let setId = Number(id);
    if(setType == 'Deck'){
      this.getDeckAndCardsForTransfer(side, setId);
    }
  }

  getDeckAndCardsForTransfer(side:string, deckId:number){
    this.service.getDeckAndCardsForTransfer(deckId).subscribe(data => {
      if(side == 'L'){
        this.leftUserSetCollecton = data;
      } else {
        this.rightUserSetCollection = data;
      }


    }, error => {
      this.errorDialog("Sorry, something wrong happened! Try again later");
      console.log(error);
    })
  }



  cardImagem(cardId: any){
    let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/'+cardId+'.jpg';
    return urlimg;
  }

  mostrarImgToolTip(img:string, e){
    this.leftTp =  e.pageX + 15 + "px";
    this.topTp = + e.pageY + 15 + "px";

    //this.imgTooltip = img;
    this.imgTooltip = e.target.src;
    this.isShowTooltip = true;
 }

 esconderImgToolTip(){
  this.isShowTooltip = false;
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
