import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
    // Encapsulation has to be disabled in order for the
  // component style to apply to the select panel.
  encapsulation: ViewEncapsulation.None,
})
export class TransferComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  cardImagem(cardId: any){
    let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/'+cardId+'.jpg';
    return urlimg;
  }

}
