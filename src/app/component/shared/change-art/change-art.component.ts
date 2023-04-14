import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { ChangeArtService } from './change-art.service';

export interface DialogData{
    cardId:number
}

@Component({
  selector: 'app-change-art',
  templateUrl: './change-art.component.html',
  styleUrls: ['./change-art.component.css']
})
export class ChangeArtComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ChangeArtComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private service: ChangeArtService) { }

    alternativesArts:number [] = [];

    ngOnInit() {
      this.getCardAlternativeArts()
    }

    getCardAlternativeArts(){
        this.service.getAlternativeNumbers(this.data.cardId).subscribe(result => {
            this.alternativesArts = result
        })
    }

    selectedCard:number = 0;

    onNoClick(): void {
      this.dialogRef.close();
    }

    cardSelected(id:number){
      this.selectedCard = id
    }

    cardChoosen() {
       this.dialogRef.close(this.selectedCard);     
    }

    cardImagem(cardId: any){
      let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
      return urlimg;
    }
}
