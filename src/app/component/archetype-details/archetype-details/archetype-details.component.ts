import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Archetype } from 'src/app/classes/Archetype';
import { AchetypeService } from 'src/app/service/archetype-service/achetype.service';

import {MatSort} from '@angular/material/sort';

import { CardServiceService } from 'src/app/service/card-service/card-service.service';

@Component({
  selector: 'app-archetype-details',
  templateUrl: './archetype-details.component.html',
  styleUrls: ['./archetype-details.component.css']
})
export class ArchetypeDetailsComponent  implements OnInit  {
  archetype: Archetype[] = [];

  constructor(private archService: AchetypeService, private cardService: CardServiceService) {
   
  }
  

  ngOnInit() {
    this.loadArchetypeDetails();
  }

  storedCardId(numero){
    localStorage.setItem("idCard", numero); 
  }

  cardImagem(cardId: any){
    let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/' + cardId + '.jpg';
    return urlimg;
  }

  loadArchetypeDetails(){
    const id = localStorage.getItem("idArchetype");
   // const id = this.archService.getArchetypeId();
    this.archService.getArchetype(id).subscribe(data =>{    
      console.info(data)
     this.archetype = data;
    
    })
  }
  

   isShowTooltip: boolean = false;
    imgTooltip: string;
    topTp;
    leftTp;
 
    mostrarImgToolTip(e){
        this.leftTp =  e.pageX + 15 + "px";
        this.topTp = + e.pageY + 15 + "px";
   
        //this.imgTooltip = img; se necessario coloca mais um argumento, o caminho da imagem
        this.imgTooltip = e.target.src;
        this.isShowTooltip = true;
     }
   
     esconderImgToolTip(){
      this.isShowTooltip = false;
    }

}
