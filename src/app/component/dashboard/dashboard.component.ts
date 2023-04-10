import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service: DashboardService) { }

  fullStats: any = {}

  attributesArray

  ngOnInit() {
    this.getStats()
  }

  getStats(){
      this.service.getStats().subscribe(data =>{
          this.fullStats = data
          console.log(this.fullStats)
      })  
  }
}

export class Attributes {
    name:string;
    path:string;
    qtd: number

    constructor(name:string,path:string,qtd: number){}
}
