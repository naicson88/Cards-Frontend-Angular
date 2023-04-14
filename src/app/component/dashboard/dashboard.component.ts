import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: DashboardService) { }

  fullStats: any = {}

  ngOnInit() {
    this.getStats()
  }

  getStats(){
      this.service.getStats().subscribe(data =>{
          this.fullStats = data
          console.log(this.fullStats)
      })  
  }

  setRarityColor(rarity:string){
    return GeneralFunctions.colorRarity(rarity);
  }

  cardImagem(cardId: any){
    var num: number = +cardId;
    let urlimg = GeneralFunctions.cardImagem + num + '.jpg';
    return urlimg;
  }
}

