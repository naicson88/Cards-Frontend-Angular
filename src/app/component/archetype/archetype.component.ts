import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype } from 'src/app/classes/Archetype';
import { AchetypeService } from 'src/app/service/archetype-service/achetype.service';
import { applyLoader } from '../shared/decorators/Decorators';

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

  @applyLoader()
  loadAllArchetypes(){
    this.service.getAllArchetypes().subscribe(data => {
    this.archetype = data;
    }, error => {
      console.log(error);
    })
  }

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
