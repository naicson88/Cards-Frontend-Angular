import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype } from 'src/app/classes/Archetype';
import { AchetypeService } from 'src/app/service/archetype-service/achetype.service';
import { applyLoader } from '../shared/decorators/Decorators';
import { GeneralFunctions } from "src/app/Util/Utils";

@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.css']
})
export class ArchetypeComponent implements OnInit {

  constructor(private router: Router, private service: AchetypeService, private archService: AchetypeService, ) { }

  ngOnInit() {
    this.loadAllArchetypes();
  }

  archetype: Archetype[] = [];
  newArchMap: any
  @applyLoader()
  loadAllArchetypes(){
    this.service.getAllArchetypes().subscribe(data => {
    this.newArchMap = data;
    console.log(this.newArchMap)
    }, error => {
      console.log(error);
    })
  }

// private  tranformMapInArray(originalMap: object){  
//     Object.entries(originalMap).forEach((arc) => {
//       this.newArchArray.push({
//         letter: arc[0],
//         archetypes: arc[1],
//     });

//   return this.newArchArray;
// })
// }

  goToLetter(ele:string){
  
    var elemento = document.getElementById(ele);
    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline : "nearest"
    })
    elemento.style.color = 'red'
  }

  
  storedArchetype(id){     
   // const id = event.target.id;
     localStorage.setItem("idArchetype", id);
  }

}
