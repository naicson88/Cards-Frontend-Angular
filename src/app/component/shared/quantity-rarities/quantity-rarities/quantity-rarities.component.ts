import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GeneralFunctions } from 'src/app/Util/Utils';

@Component({
  selector: 'app-quantity-rarities',
  templateUrl: './quantity-rarities.component.html',
  styleUrls: ['./quantity-rarities.component.css'],
  "preserveWhitespaces": true 
})
export class QuantityRaritiesComponent implements OnInit, OnChanges  {
  @Input() rarities:{}

  raritiesName:string[] = [];
  raritiesQuantity:string[] = [];

  mapRarity = new Map<string, string>([
      ['Common', 'table-primary'],
      ['Rare', 'table-info'],
      ['Super Rare', 'table-success'],
      ['Ultra Rare', 'table-warning'],
      ['Secret Rare', 'table-danger'],
      ['Ultimate Rare', 'table-success'],
      ['Gold Rare', 'table-info'],
      ['Parallel Rare', 'table-success'],
      ['Ghost Rare', 'table-warning'],
  ]);

  constructor() { }

  ngOnInit() {
     
  }

  ngOnChanges(): void {
    this.getEntries(this.rarities)
  }

  getEntries(obj: object) {
      if(obj != undefined){
        this.raritiesName = Object.keys(obj)
        this.raritiesQuantity = Object.values(obj)
      }   
  }

  getRarityClass(rarity:string) {
      return this.mapRarity.get(rarity);
  }

}
