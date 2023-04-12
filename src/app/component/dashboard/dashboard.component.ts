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

  ngOnInit() {
    this.getStats()
  }

  getStats(){
      this.service.getStats().subscribe(data =>{
          this.fullStats = data
          console.log(this.fullStats)
          console.log(this.fullStats.setStats.listDef)
      })  
  }
}

