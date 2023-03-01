import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
    this.createFormSet(new SetDetailsDTO)
  }

  formSearchToEdit: FormGroup = new FormGroup({})
  formEditSet: FormGroup = new FormGroup({})

  setDetailsDeck: SetDetailsDTO;
  arrSetSource:[] = [];

  foundSetToEdit: boolean = true

  createFormSet(setData: SetDetailsDTO){
    this.formEditSet = new FormGroup({
      id: new FormControl({value: setData.id, disabled: true}, Validators.required),
      nome: new FormControl(setData.nome, Validators.required),
      lancamento:new FormControl(setData.lancamento),
      imagem: new FormControl(setData.imagem),
      setType: new FormControl(setData.setType),
      setCode: new FormControl(setData.setCode),
      isSpeedDuel: new FormControl(setData.isSpeedDuel),
      isBasedDeck: new FormControl(setData.isBasedDeck),
      description: new FormControl(setData.description),
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

  searchDeckToEdit(deckId:number){
      this.service.searchDeckToEdit(deckId).subscribe(response => {
          this.setDetailsDeck = response;
          this.createFormSet(response)

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

          this.myEditor.data = this.setDetailsDeck.description;
          //console.log(this.setDetailsDeck) 
      })
  }

  onSubmit(){
      this.formEditSet.value.description =  this.ckEditor.getData(this.myEditor);

      this.service.editDeck(this.formEditSet.value).subscribe(result => {
        console.warn(result);
        this.toastr.success("Deck edited successfully!");
      }, error =>{
        console.log(error.msg)
      })
  }

  cardImagem(cardId: any){
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

}
