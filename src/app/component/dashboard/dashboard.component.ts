import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  id:string;
  source:string;
  setType:string;

  constructor(private service: DashboardService, private route: ActivatedRoute) {
       
   }

  fullStats: any = {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.source = params['source'];
      this.setType = params['setType'];
      this.getStats(this.id, this.source, this.setType)
  });
    
  }

  getStats(id:string, source:string, setType:string){
      this.service.getStats(id, source, setType).subscribe(data =>{
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

