import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SetEditDTO } from 'src/app/classes/DTO/SetEditDTO';
import { SetDetailsDTO } from 'src/app/classes/SetDetailsDTO';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';
import { AdminDashboardService } from '../admin-dashboard-service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-edit-set',
  templateUrl: './admin-edit-set.component.html',
  styleUrls: ['./admin-edit-set.component.css']
})
export class AdminEditSetComponent implements OnInit {

  constructor(private admin: AdminDashboardComponent,  private ckEditor: CkeditorComponent, private service: AdminDashboardService, private toastr: ToastrService,) { }

  @ViewChild('isSpeedDuel', {static: false}) isSpeedDuel: ElementRef;
  @ViewChild('isBasedDeck', {static: false}) isBasedDeck: ElementRef;
  @ViewChild('setType', {static: false}) setType: ElementRef;
  @ViewChild("myEditor", { static: false }) myEditor: any; 

  ngOnInit() {
    this.createFormSet(new SetEditDTO, false)
  }

  formSearchToEdit: FormGroup = new FormGroup({})
  formEditSet: FormGroup = new FormGroup({})

  setDetailsDeck: SetEditDTO;
  arrSetSource:[] = [];

  foundSetToEdit: boolean = true

  createFormSet(setData: SetEditDTO, isDeckType){
    this.formEditSet = new FormGroup({
      id: new FormControl(setData.id),
      nome: new FormControl(setData.nome, Validators.required),
      lancamento:new FormControl(setData.lancamento),
      imagem: new FormControl(setData.imagem),
      setType: new FormControl(setData.setType),
      setCode: new FormControl(setData.setCode),
      isSpeedDuel: new FormControl(setData.isSpeedDuel),
      isBasedDeck: new FormControl(setData.isBasedDeck),
      //description: new FormControl(setData.description),
      relDeckCards: new FormControl(setData.relDeckCards),
      isDeckType: new FormControl(isDeckType)
    })
  }

  searchSets(setType:string){ 
    if(setType == null || setType == ""){
        alert("Invalid setType");
        return false;
    }     
    console.log(setType)
    this.admin.searchSets(setType).subscribe(data => {
      this.arrSetSource = data
    });
  }

  onChangeEnableSaveButton(num:string) {
     (document.getElementById("btn-"+num) as HTMLButtonElement).disabled = false;
  }

  searchDeckToEdit(deckId:number, setType:string){
  
      this.service.searchDeckToEdit(deckId, setType).subscribe(response => {
          this.setDetailsDeck = response;
          let isDeckType =   this.setDetailsDeck.setType == 'DECK' ? true : false
          this.createFormSet(response, isDeckType)
          console.log(this.formEditSet) 

          let i:number = this.setDetailsDeck.isSpeedDuel ? 0 : 1;
          this.isSpeedDuel.nativeElement.options[i].selected = true;

          let j:number = this.setDetailsDeck.isBasedDeck ? 0 : 1;
          this.isBasedDeck.nativeElement.options[j].selected = true;

          for(let i = 0; i < this.setType.nativeElement.options.length; i++){
              if(this.setType.nativeElement.options[i].value === this.setDetailsDeck.setType){
                  this.setType.nativeElement.options[i].selected = true;
                  break;
              }
          }

          this.myEditor.data = response.description;
         
      })
  }

  onSubmit(){
      this.formEditSet.value.description =  this.ckEditor.getData(this.myEditor);
      if(this.formEditSet.value.isDeckType){
          this.service.editDeck(this.formEditSet.value).subscribe(result => {
            this.toastr.success("Deck edited successfully!");
          }, error =>{
            this.toastr.error("Cannot save the Set!");
            console.log(error.msg)
          })
      }  else {
        this.service.editCollection(this.formEditSet.value).subscribe(result => {
          this.toastr.success("Collection edited successfully!");
        }, error =>{
          this.toastr.error("Cannot save the Set!");
          console.log(error.msg)
        })
      }  
  }

  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  setOnFormToEdit(id:number){
    var idNumber: number = +id;
    if(this.setDetailsDeck.id == idNumber){
      let isDeckType =   this.setDetailsDeck.setType == 'DECK' ? true : false;
      this.createFormSet(this.setDetailsDeck, isDeckType)
    }
    else
        this.createFormSet(this.setDetailsDeck.insideDecks.find(inside => inside.id === idNumber), true)
    
  }

}
