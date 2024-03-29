import { Component, OnInit ,Pipe} from '@angular/core';
import { Deck } from 'src/app/classes/Deck';
import { DeckService } from 'src/app/service/deck.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/service/spinner.service';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { SuccessDialogComponent } from '../dialogs/success-dialog/success-dialog.component';
import { GeneralFunctions } from 'src/app/Util/Utils';
import { applyLoader } from '../shared/decorators/Decorators';
import { DialogUtils } from 'src/app/Util/DialogUtils';



@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

@Pipe({
  name: 'appFilter'
})

export class DeckComponent implements OnInit {
 dialogUtils = new DialogUtils(this.dialog); 
 page: number = 1; 
 pageSize: number = 25
 pageSizes = [25,50,75,100];
 totalItens = 0;
 set_type: string;
 source: string
 deck: Deck[]
 relUserDeck: any[];
 safeUrl: SafeUrl;
 arrayAutocomplete: any[] = [];
 filteredAutocomplete: any[];
 user: any;
 imgPath: string;
 
  constructor(private service: DeckService, private domSanitizer: DomSanitizer, private  router: Router, public dialog: MatDialog,
     private toastr: ToastrService, private  spinner: SpinnerService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.route.data.subscribe(set_type =>{
      this.set_type = set_type.set_type;
    })

    this.route.data.subscribe(source =>{
      this.source = source.source;
      console.log(source)
    })


    this.getDecksInfo();
    this.autocompleteSets(this.source);

  }

  deckDetailPage(nome:any){
    if(nome != null ){
      this.router.navigate(['deck-details', nome]);
    }
  }
  
  @applyLoader()
  getDecksInfo(): void {
      const params = this.getRequestParam(this.pageSize, this.page);
  
      this.service.getDecks(params, this.set_type, this.source).subscribe(data => {
        
       const {content, totalElements} = data;
        //console.log(data);
        this.deck = content;
    
        this.totalItens = totalElements;
  
        for(let i = 0; i < this.deck.length; i++){
          //Angular apresentava como se o link da imagem fosse unsafe/perigoso
          this.safeUrl = this.domSanitizer.bypassSecurityTrustUrl(this.deck[i].imagem);  
        }
      })
    
    error => {
      console.log(error);
    }
  }

  autocompleteSets(source:string){
    this.service.autcompleteSets(source).subscribe(data => {
      this.arrayAutocomplete = data;
      console.log(JSON.stringify(this.arrayAutocomplete));
    })
  }

  getRequestParam(pageSize, page){
  let params = {}

  if (page) {
    params[`page`] = page - 1;
  }

  if (pageSize) {
    params[`size`] = pageSize;
  }

  return params;

  }
    removeSetToUserCollection(event:any) {
      
      let qtdCardManeged:number;
      let setId = event.target.id
      let i = this.deck.findIndex(deck => deck.id == setId);

      let conf= confirm("Are you sure you want to delete from your collection?")

      if(conf){

        if(this.set_type == 'DECK'){
          this.service.removeDeckToUsersCollection(setId).subscribe(data => {
            qtdCardManeged = data;   
              this.toastr.warning('The Deck has been removed from your collection! Plus ' + qtdCardManeged + ' cards of this deck.', 'Success!');
         
          }, error => {
            console.log(error)
            this.dialogUtils.errorDialog("Sorry, something bad happened.")
           
          })
        } else {
          this.service.removeSetToUsersCollection(setId).subscribe(data => {
              
            qtdCardManeged = data;    
              this.toastr.warning('Set has been removed from your collection!', 'Warning!');
            
          }, error => {
            console.log(error)
            this.dialogUtils.errorDialog("Sorry, something bad happened.")
           
          })
        }

        this.deck.splice(i, 1);

      } else {
          return false;
      }
    }

  ordenacaoArrayAPI(){
    this.deck.sort(function(a,b){
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;  
    })
  }

  handlePageSizeChange(event): void {

    this.pageSize = event//event.value;
    this.page = 1;
    this.getDecksInfo();
  }

  handlePageChange(event) {
      this.page = event;
      this.getDecksInfo();
   
  }

  storeDeckId(id:any, setType:string) {
    setType =  setType != 'DECK' ? 'COLLECTION' : 'DECK'
    GeneralFunctions.saveDeckInfoLocalStorage(id, this.source, setType);
  }
  
  addDeckToCollection(e){
    const deckId = e.target.name;
    
    //console.log(deckId, this.user)
   this.toastr.success('The Deck has been added to your collection!', 'Success!')
  }

  setName:string = '';
  searchByName(){

    this.service.searchBySetName(this.setName, this.source).subscribe( data => {
        
        let decksFound:any[] = [];
        const {content, totalElements} = data;

        decksFound = content;

        if(decksFound == null || decksFound == undefined || decksFound.length == 0){
            if(this.source == 'KONAMI')
              this.toastr.warning("No Set found with this name")
            else
              this.toastr.warning("No Set found with this name in yout collection")
        } else {
          this.deck = [];
          this.deck = decksFound;
          this.toastr.success(this.deck.length + " Set(s) found")
        }
      
    }, error => {
    
      this.dialogUtils.errorDialog("Sorry, some error happened. Try again later.");
    })

  }

  getSetTypeValue(setType:string){

    if(setType == null || setType == undefined){
      this.dialogUtils.errorDialog("Sorry, it was not possible consult itens.");
      return false;
    }

    this.set_type = setType;
    this.deck = [];
    this.totalItens = null;

    this.getDecksInfo();
     
  }

   _filter(value:string): any[]{
   
    if(value.length >= 3){
      const filterValue = this._normalizeValue(value);    
      this.filteredAutocomplete = this.arrayAutocomplete.filter(set => this._normalizeValue(set.setName).includes(filterValue)) ;
      return this.filteredAutocomplete  
      }
    }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  
}
