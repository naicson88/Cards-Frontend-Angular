import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quantity-rarities',
  templateUrl: './quantity-rarities.component.html',
  styleUrls: ['./quantity-rarities.component.css']
})
export class QuantityRaritiesComponent implements OnInit {
  @Input() rarities:{}
  
  constructor() { }

  ngOnInit() {
  }

}
