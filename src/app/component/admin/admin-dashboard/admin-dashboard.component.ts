import { HttpClient } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KonamiDeck } from 'src/app/classes/KonamiDeck';
import { AdminDashboardService } from '../admin-dashboard-service';
import {formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SetCollection } from 'src/app/classes/SetCollection';
import { SpinnerService } from 'src/app/service/spinner.service';
import { DeckCollection } from 'src/app/classes/DeckCollection';
import { Observable, Subject } from 'rxjs';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';
import { applyLoader } from '../../shared/decorators/Decorators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

  formDeck: FormGroup;
  formCollection: FormGroup;
  formDeckCollection: FormGroup;

  chosenMenu:string = "NEW SET"

  setsSearched: any[] = []

  constructor(private adminService: AdminDashboardService, private http: HttpClient, private toastr: ToastrService,
     private spinner: SpinnerService, private ckEditor: CkeditorComponent) {}


  ngOnInit() {
    this.createFormDeck(new KonamiDeck())
    this.createCollectionDeck(new DeckCollection())
  }

  showForm(menu:string){
    this.chosenMenu = menu;
    if(menu == 'NEW COLLECTION')
      this.createFormSetCollection(new SetCollection());
    else if (menu == 'DECK COLLECTION')
      this.createCollectionDeck(new DeckCollection);
  }
  
 @ViewChild("myEditor", { static: false }) myEditor: any; 
  onSubmit(){  

    this.formDeck.value.lancamento = formatDate(this.formDeck.value.lancamento, 'dd-MM-yyyy', 'en-US')
    this.formDeck.value.description = this.ckEditor.getData(this.myEditor);
    this.spinner.show()
    this.adminService.createNewKonamiDeck(this.formDeck.value).subscribe(result => {
      console.warn(result); 
      this.toastr.success("Deck information sent to Queue");
      this.spinner.hide()
    }, error =>{
      this.spinner.hide()
      console.log(error)
      this.toastr.error("Error to create new Deck")
    })
    
  }

  createFormDeck(konamiDeck:KonamiDeck){
    this.formDeck = new FormGroup({
      nome: new FormControl(konamiDeck.nome, {validators: [Validators.required] , updateOn: 'blur'}),
      setType: new FormControl(konamiDeck.setType, [Validators.required]),
      lancamento: new FormControl(konamiDeck.lancamento, [Validators.required]),
      imagem: new FormControl(konamiDeck.imagem, [Validators.required]),
      isSpeedDuel: new FormControl(konamiDeck.isSpeedDuel, [Validators.required]),
      requestSource: new FormControl(konamiDeck.requestSource, [Validators.required]),
      setCode: new FormControl(konamiDeck.setCode, [Validators.required]),
      isBasedDeck: new FormControl(false),
      description: new FormControl('')
    })
  }

  onSubmitSetCollection(){

    this.formCollection.value.releaseDate = formatDate(this.formCollection.value.releaseDate, 'dd-MM-yyyy', 'en-US')
    this.formCollection.value.description = this.ckEditor.getData(this.myEditor);

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
      imgPath: new FormControl(setCollection.imgPath),
      deckParameters: new FormControl(setCollection.deckParameters),
      setType: new FormControl(setCollection.setType),
      releaseDate: new FormControl(setCollection.releaseDate),
      onlyDefaultDeck: new FormControl(setCollection.onlyDefaultDeck),
      isSpeedDuel: new FormControl(setCollection.isSpeedDuel),
      requestSource : new FormControl(setCollection.requestSource),
      setCode: new FormControl(setCollection.setCode),
      description: new FormControl('')
    })
   
  } 

  submitCollectionDeck(){ 
      debugger
      let value = this.formDeckCollection.value
   // this.formDeckCollection.value.lancamento = formatDate(this.formDeckCollection.value.lancamento, 'dd-MM-yyyy', 'en-US')
      this.adminService.createNewDeckCollection(value).subscribe(result => {
      this.toastr.success("Deck Collection sent to Queue");
      this.formCollection.reset();

    }, error => {
       this.toastr.error("Something bad happened. " + error)
    })

  }

  createCollectionDeck(collectionDeck: DeckCollection){
    this.formDeckCollection = new FormGroup({
      nome: new FormControl(collectionDeck.nome),
      //nomePortugues: new FormControl(collectionDeck.nomePortugues),
      setType: new FormControl(collectionDeck.setType),
      //lancamento: new FormControl(collectionDeck.lancamento),
      imagem: new FormControl(collectionDeck.imagem),
      //isSpeedDuel: new FormControl(collectionDeck.isSpeedDuel),
      requestSource: new FormControl(collectionDeck.requestSource),
      setId: new FormControl(collectionDeck.setId),
      filterSetCode: new FormControl(collectionDeck.filterSetCode),
      isBasedDeck: new FormControl(collectionDeck.isBasedDeck)
    })
  }

  @applyLoader()
  public searchSets(setType:string): Observable <any> {
    var subject = new Subject<any>();
    if(setType == 'DECK'){
      this.adminService.getDecksNames(false).subscribe(names => {
          this.setsSearched = names; 
          subject.next(names);    
   
      }, error => { 
        alert("It was not possible search sets")
      })
    } else {
      this.adminService.getSetCollectionNames(setType).subscribe(names => {
          this.setsSearched = names;
          subject.next(names);    
        
      }, error => { 
        alert("It was not possible search sets")
      
      },)
    } 
    
    return subject.asObservable();
  }

 showCk(){
    const domEditableElement = document.querySelector('.ck-editor__editable');
    console.log(domEditableElement)
 }

}
