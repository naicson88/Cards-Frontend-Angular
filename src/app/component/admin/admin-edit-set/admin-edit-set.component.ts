import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators,  FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { SetEditDTO } from 'src/app/classes/DTO/SetEditDTO';
import { ECardRarities } from 'src/app/classes/enum/ECardRarity';
import { RelDeckCards } from 'src/app/classes/Rel_Deck_Cards';
import { SetDetailsDTO } from 'src/app/classes/SetDetailsDTO';
import { SpinnerService } from 'src/app/service/spinner.service';
import { GeneralFunctions } from 'src/app/Util/Utils';
import { ChangeArtComponent } from '../../shared/change-art/change-art.component';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';
import { AdminDashboardService } from '../admin-dashboard-service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { applyLoader } from '../../shared/decorators/Decorators';

@Component({
  selector: 'app-admin-edit-set',
  templateUrl: './admin-edit-set.component.html',
  styleUrls: ['./admin-edit-set.component.css']
})
export class AdminEditSetComponent implements OnInit {

  constructor(private admin: AdminDashboardComponent,  private ckEditor: CkeditorComponent, private service: AdminDashboardService, private toastr: ToastrService,
    private dialog: MatDialog, private spinner: SpinnerService) { }

  @ViewChild('isSpeedDuel', {static: false}) isSpeedDuel: ElementRef;
  @ViewChild('isBasedDeck', {static: false}) isBasedDeck: ElementRef;
  @ViewChild('setType', {static: false}) setType: ElementRef;
  @ViewChild("myEditor", { static: false }) myEditor: any; 

  ngOnInit() {
    this.createFormSet(new SetEditDTO, false)
    this.createFormRel(new RelDeckCards)
  }

  formSearchToEdit: FormGroup = new FormGroup({})
  formRelation: FormGroup = new FormGroup({})
  formEditSet: FormGroup = new FormGroup({})

  setDetailsDeck: SetEditDTO;
  arrSetSource:[] = [];
  listRarities:string[] = [];

  foundSetToEdit: boolean = true

  createFormSet(setData: SetEditDTO, isDeckType:boolean){
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

  createFormRel(relation: RelDeckCards){
    this.formRelation = new FormGroup({
      cardId: new FormControl(Number(relation.cardId), Validators.required),
      deckId: new FormControl(Number(relation.deckId), Validators.required),
      cardNumber: new FormControl(Number(relation.cardNumber), Validators.required),
      cardSetCode: new FormControl(relation.cardSetCode, Validators.required),
      card_price: new FormControl(Number(relation.card_price), Validators.required),
      card_raridade: new FormControl(relation.card_raridade, Validators.required),
      isSideDeck: new FormControl(Boolean(relation.isSideDeck, ), Validators.required),
      isSpeedDuel: new FormControl(Boolean(relation.isSpeedDuel), Validators.required),
      quantity: new FormControl(Number(relation.quantity), Validators.required),
      setRarityCode: new FormControl(relation.setRarityCode, Validators.required),
      rarityDetails: new FormControl(relation.rarityDetails, Validators.required),
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

  saveRelDeckCards(rel:RelDeckCards){
      this.service.saveRelDeckCards(rel).subscribe(result => {
        this.toastr.success("Relation edited successfully!");
        this.getRelationByDeckId(rel.deckId);
      } , error =>{
        this.toastr.error("Cannot save the Set!");
        console.log(error.msg)
      })
  }

  keyDownChangeValue(card:RelDeckCards, e:any, propertie:string){
      card[propertie] = e.target.value;
  }

  openDialogArt(card:RelDeckCards){
      const dialogRef = this.dialog.open(ChangeArtComponent, {
        data: {cardId: card.cardId}
      });

      dialogRef.afterClosed().subscribe(result => {
          if(result != undefined)
            card['cardNumber'] = result
      })

      this.onChangeEnableSaveButton(card.cardId.toString());
  }

  removeRelation(card:RelDeckCards) {
      if(confirm("Are sure want to delete this Relation?")){
          this.service.deleteRelation(card.id).subscribe(result => {            
              this.getRelationByDeckId(card.deckId);
              this.toastr.success("Relation removed successfully");           
          })
      }
  }

  @applyLoader()
  getRelationByDeckId(deckId:number) {
    
      this.service.getRelationByDeckId(deckId).subscribe(result => {
          this.formEditSet.value.relDeckCards = [];
          this.formEditSet.value.relDeckCards = result;
       ;
      }, error => {
        console.log(error)
      
      })
  }

  submitFormRelation(){  
    console.log(this.formRelation.value)
    this.service.saveRelation(this.formRelation.value).subscribe(result => {
        this.toastr.success("Card Relation saved successfully!");       
    }, error => {
      this.toastr.error("Cannot save Relation");       
    })
  }

  setRarities() {
      let rarities = Object.values(ECardRarities)
      console.log(rarities) 
      for ( let index in rarities ){
          this.listRarities.push(rarities[index])
      }  
  }
}
