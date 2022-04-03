import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KonamiDeck } from 'src/app/classes/KonamiDeck';
import { AdminDashboardService } from '../admin-dashboard-service';
import {formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SetCollection } from 'src/app/classes/SetCollection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  formDeck: FormGroup;
  formCollection: FormGroup;

  chosenMenu:string = "NEW SET"

  constructor(private adminService: AdminDashboardService, private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    this.createFormDeck(new KonamiDeck())
  }

  showForm(menu:string){
    this.chosenMenu = menu;
    if(menu == 'NEW COLLECTION')
      this.createFormSetCollection(new SetCollection());
  }

  onSubmit(){  

    this.formDeck.value.lancamento = formatDate(this.formDeck.value.lancamento, 'dd-MM-yyyy', 'en-US')
    
    this.adminService.createNewKonamiDeck(this.formDeck.value).subscribe(result => {
      console.warn(result);
      this.toastr.success("Deck information sent to Queue");
      this.formDeck.reset();
    }, error =>{
      console.log(error.msg)
    })
    
  }

  createFormDeck(konamiDeck:KonamiDeck){
    this.formDeck = new FormGroup({
      nome: new FormControl(konamiDeck.nome),
      nomePortugues: new FormControl(konamiDeck.nomePortugues),
      setType: new FormControl(konamiDeck.setType),
      lancamento: new FormControl(konamiDeck.lancamento),
      imagem: new FormControl(konamiDeck.imagem)
    })
  }

  onSubmitSetCollection(){
    debugger
    console.log(this.formCollection);
    this.formCollection.value.releaseDate = formatDate(this.formCollection.value.releaseDate, 'dd-MM-yyyy', 'en-US')
     
    this.adminService.createNewSetCollection(this.formCollection.value).subscribe(result => {
      console.log(result)
      this.toastr.success("SetCollection sent to Queue")
      this.formCollection.reset()
    }, error => {
      this.toastr.error("Something bad happened. " + error)
    })
   
  }

  createFormSetCollection(setCollection: SetCollection){
    this.formCollection = new FormGroup({
      name: new FormControl(setCollection.name),
      portugueseName: new FormControl(setCollection.portugueseName),
      imgPath: new FormControl(setCollection.imgPath),
      deckParameters: new FormControl(setCollection.deckParameters),
      setType: new FormControl(setCollection.setType),
      releaseDate: new FormControl(setCollection.releaseDate),
      onlyDefaultDeck: new FormControl(setCollection.onlyDefaultDeck)
    })
   
  }

}
