import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Archetype } from 'src/app/classes/Archetype';
import { AchetypeService } from 'src/app/service/archetype-service/achetype.service';
import { SpinnerService } from 'src/app/service/spinner.service';


@Component({
  selector: 'app-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.css']
})
export class ArchetypeComponent implements OnInit {

  constructor(private router: Router, private service: AchetypeService, private archService: AchetypeService, private spinner: SpinnerService) { }

  ngOnInit() {
    this.loadAllArchetypes();
  }

  archetype: Archetype[] = [];

  loadAllArchetypes(){
    this.spinner.show();
    this.service.getAllArchetypes().subscribe(data => {
    this.archetype = data;
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
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
    debugger
   // const id = event.target.id;
    localStorage.setItem("idArchetype", id);

  }

}
