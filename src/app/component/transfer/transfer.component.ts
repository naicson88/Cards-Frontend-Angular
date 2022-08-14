import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(private service: TransferService) { }

  topTp;
  leftTp;
  imgTooltip: string;
  isShowTooltip: boolean = false;
  isVisible = false;

  rightSets: any[] = [];
  leftSets: any[] = [];

  ngOnInit() {
  }


  searchSets(setType:string, side:string){
    debugger
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

}
