import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SetDetailsDTO } from 'src/app/classes/SetDetailsDTO';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';
import { AdminDashboardService } from '../admin-dashboard-service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-edit-set',
  templateUrl: './admin-edit-set.component.html',
  styleUrls: ['./admin-edit-set.component.css']
})
export class AdminEditSetComponent implements OnInit {

  constructor(private admin: AdminDashboardComponent,  private ckEditor: CkeditorComponent, private service: AdminDashboardService) { }

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
      setId: new FormControl(setData.id),
      setName: new FormControl(setData.nome),
      release:new FormControl(setData.lancamento),
      image: new FormControl(setData.imagem),
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
          console.log(this.setDetailsDeck)
      })
  }


}
