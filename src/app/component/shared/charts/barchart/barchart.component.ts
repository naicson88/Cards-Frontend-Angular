import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {Chart} from   'chart.js';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit, AfterViewInit, OnChanges {

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
     this.graficoAttackDefData();
  }
  
  @Input() attackDefData:any[]

  @ViewChild("attrCanvas",{static: false}) elemento: ElementRef; 

  ngOnInit() {
   
  }

  ngAfterViewInit(): void {
    // debugger
    // if(this.attackDefData != null && this.attackDefData != undefined){
    //   this.graficoAttackDefData();
    // }
  }
  colors: string[] = []

  getColor(value:any){
    if(value >= 0 && value <= 1000){
      return 'rgba(50, 205, 50, 0.7)'
    } 
    else if (value > 1000 && value <= 2000){
      return  'rgba(160, 82, 45, 0.7)'
    }
    else
    return 'rgba(255, 0, 0, 0.7)'
  }

  graficoAttackDefData(){

    let value: any[] = [];
    let qtd: any[] = [];

    this.attackDefData.forEach(element => {
      let v = element.value;
      this.colors.push(this.getColor(v))
      value.push(v);
    });

    this.attackDefData.forEach(element => {
      let v = element.quantity;
      qtd.push(v);
    });

    new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
          labels: value,
          datasets: [{
              label: 'QUANTITY',
              data: qtd,
              backgroundColor: this.colors,
              // [
              //     'rgba(160, 82, 45, 0.7)',
              //     'rgba(255, 0, 0, 0.7)',
              //     'rgba(50, 205, 50, 0.7)',
              //     'rgba(139, 0, 139, 0.7)',
              //     'rgba(255, 255, 0, 0.7)',
              //     'rgba(160, 82, 45, 0.7)',
              //     'rgba(255, 0, 0, 0.7)',
              //     'rgba(128,128,0, 0.7)',
              //     'rgba(50, 205, 50, 0.7)',
              //     'rgba(139, 0, 139, 0.7)',
              //     'rgba(255, 255, 0, 0.7)',
                  
                 
              // ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
  
      }
    });
  }

  graficoAtributos(){

    new Chart(this.elemento.nativeElement, {
      type: 'bar',
      data: {
          labels: ['EARTH','FIRE','WIND','DARK','LIGHT', 'WATER'],
          datasets: [{
              label: 'QUANTITY',
              data: [10,20,30,40, 35,5],
              backgroundColor: [
                  'rgba(160, 82, 45, 0.7)',
                  'rgba(255, 0, 0, 0.7)',
                  'rgba(50, 205, 50, 0.7)',
                  'rgba(139, 0, 139, 0.7)',
                  'rgba(255, 255, 0, 0.7)',
                 
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
  
      }
    });
  }

}
