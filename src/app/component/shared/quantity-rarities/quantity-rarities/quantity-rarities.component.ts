import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quantity-rarities',
  templateUrl: './quantity-rarities.component.html',
  styleUrls: ['./quantity-rarities.component.css'],
  "preserveWhitespaces": true 
})
export class QuantityRaritiesComponent implements OnInit {
  @Input() rarities:{}
  @Input() konamiRarities:{}

  constructor() { }

  ngOnInit() {

  }

}
