import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KonamiDeck } from 'src/app/classes/KonamiDeck';
import { AdminDashboardService } from '../admin-dashboard-service';
import {formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SetCollection } from 'src/app/classes/SetCollection';
import { SpinnerService } from 'src/app/service/spinner.service';
import { DeckCollection } from 'src/app/classes/DeckCollection';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  formDeck: FormGroup;
  formCollection: FormGroup;
  formDeckCollection: FormGroup;

  chosenMenu:string = "NEW SET"

  setsSearched: any[] = [];

  constructor(private adminService: AdminDashboardService, private http: HttpClient, private toastr: ToastrService,
     private spinner: SpinnerService) {}

  ngOnInit() {
    this.createFormDeck(new KonamiDeck())
  }

  showForm(menu:string){
    this.chosenMenu = menu;
    if(menu == 'NEW COLLECTION')
      this.createFormSetCollection(new SetCollection());
    else if (menu = 'DECK COLLECTION')
      this.createCollectionDeck(new DeckCollection);
  }

  onSubmit(){  
    console.log(this.formDeck.value.lancamento)
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
      imagem: new FormControl(konamiDeck.imagem),
      isSpeedDuel: new FormControl(konamiDeck.isSpeedDuel),
      requestSource: new FormControl(konamiDeck.requestSource)
    })
  }

  onSubmitSetCollection(){

    this.formCollection.value.releaseDate = formatDate(this.formCollection.value.releaseDate, 'dd-MM-yyyy', 'en-US')
     
    this.adminService.createNewSetCollection(this.formCollection.value).subscribe(result => {

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
      onlyDefaultDeck: new FormControl(setCollection.onlyDefaultDeck),
      isSpeedDuel: new FormControl(setCollection.isSpeedDuel),
      requestSource : new FormControl(setCollection.requestSource)
    })
   
  } 

  onSubmitCollectionDeck(){
    debugger
    this.formDeckCollection.value.lancamento = formatDate(this.formDeckCollection.value.lancamento, 'dd-MM-yyyy', 'en-US')
    console.log(this.formDeckCollection.value);
    this.adminService.createNewDeckCollection(this.formDeckCollection.value).subscribe(result => {
      
      this.toastr.success("Deck Collection sent to Queue")
      this.formCollection.reset();

    }, error => {
      this.toastr.error("Something bad happened. " + error)
    })

  }

  createCollectionDeck(collectionDeck: DeckCollection){
    this.formDeckCollection = new FormGroup({
      nome: new FormControl(collectionDeck.nome),
      nomePortugues: new FormControl(collectionDeck.nomePortugues),
      setType: new FormControl(collectionDeck.setType),
      lancamento: new FormControl(collectionDeck.lancamento),
      imagem: new FormControl(collectionDeck.imagem),
      isSpeedDuel: new FormControl(collectionDeck.isSpeedDuel),
      requestSource: new FormControl(collectionDeck.requestSource),
      setCollection: new FormControl(collectionDeck.setId),
      filterSetCode: new FormControl(collectionDeck.filterSetCode),
    })
  }

  searchSets(setType:string){
    this.spinner.show()
    if(setType == 'DECK'){
      this.adminService.getDecksNames().subscribe(names => {
          this.setsSearched = names;     
          this.spinner.hide();
      }, error => {  
        this.spinner.hide();
        alert("It was not possible search sets")
      })
    } else {
      this.adminService.getSetCollectionNames(setType).subscribe(names => {
          this.setsSearched = names;
          this.spinner.hide();
      }, error => { 
        alert("It was not possible search sets")
        this.spinner.hide();
      })
    }  
  }
}
