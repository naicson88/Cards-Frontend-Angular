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



@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

@Pipe({
  name: 'appFilter'
})

export class DeckComponent implements OnInit {
 page: number = 1; 
 pageSize: number = 12
 pageSizes = [12,24,48,100];
 totalItens = 0;

 set_type: string;
 source: string

 deck: Deck[]
 relUserDeck: any[];
 safeUrl: SafeUrl;
 deckFilter: any= {nome:''}

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
    })


    this.getDecksInfo();

  }

  deckDetailPage(nome:any){
    if(nome != null ){
      this.router.navigate(['deck-details', nome]);
    }
  }
 
  getDecksInfo(): void {
    // this.imgPath =  Imagens.basic_img_path + this.set_type.toLowerCase() + "\\";
    // console.log(this.imgPath)

    const params = this.getRequestParam(this.pageSize, this.page);
    this.spinner.show();
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

    addSetToUserCollection(event:any){
      let qtdCardManeged:number;
      let setId =  event //event.target.name;

      if(this.set_type == 'DECK'){

        this.service.addDeckToUsersCollection(setId).subscribe(data => {
          qtdCardManeged = data;
  
          if(qtdCardManeged == 0){
            return false;
          }
  
          if(qtdCardManeged > 0){
            this.toastr.success('The Set has been added to your collection! Plus ' + qtdCardManeged + ' cards of this Deck.', 'Success!');
              
            this.manegeQuantity(setId, "A");
  
          } else {
            this.toastr.error('Unable to add the Deck or Cards to the user.', 'Error!')
          }
  
        })

      } else {
        
        this.service.addSetToUsersCollection(setId).subscribe(data => {
          qtdCardManeged = data;
  
          if(qtdCardManeged == 0){
            return false;
          }
  
          if(qtdCardManeged > 0){
            this.toastr.success('The Set has been added to your collection! Plus ' + qtdCardManeged + ' cards of this Deck.', 'Success!');
              
            this.manegeQuantity(setId, "A");
  
          } else {
            this.toastr.error('Unable to add the Deck or Cards to the user.', 'Error!')
          }
  
        })
      }
      
    }

    removeSetToUserCollection(event:any) {
      
      let qtdCardManeged:number;
      let setId = event.target.id
      let i = this.deck.findIndex(deck => deck.id == setId);

      let conf= confirm("Are you sure you want to delete from your collection?")

      if(conf){

        if(setId == null || setId == undefined || setId == "")
        alert("It was not possible remove this set. Try again later.")

        if(this.set_type == 'DECK'){
          this.service.removeDeckToUsersCollection(setId).subscribe(data => {
            qtdCardManeged = data;   
              this.toastr.warning('The Deck has been removed from your collection! Plus ' + qtdCardManeged + ' cards of this deck.', 'Success!');
         
          }, error => {
            console.log(error)
            this.errorDialog("Sorry, something bad happened.")
           
          })
        } else {
          this.service.removeSetToUsersCollection(setId).subscribe(data => {
            qtdCardManeged = data;    
              this.toastr.warning('The Deck has been removed from your collection! Plus ' + qtdCardManeged + ' cards of this deck.', 'Success!');
            
          }, error => {
            console.log(error)
            this.errorDialog("Sorry, something bad happened.")
           
          })
        }

       

        this.deck.splice(i, 1);

      } else {
          return false;
      }
    }

  manegeQuantity(deckId:string, flagAddOrRemove:string){
  
    let id = "inp_"+deckId;
    let el =(<HTMLInputElement>document.getElementById(id));
    let valor = el.value;
    if(valor != null){
      let parsed = parseInt(valor);
      
      if(flagAddOrRemove == 'A'){
        parsed += 1;
      } else if (flagAddOrRemove == 'R' && parsed > 0){
        parsed -= 1;
      } else {
        
        return ;
      }      
      
      if(parsed != NaN && parsed != undefined){
        (<HTMLInputElement>document.getElementById(id)).value = parsed.toString();
      
      }    
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

  storeDeckId(id:any){
  //  const id = event.target.name;
    localStorage.setItem("idDeckDetails", id);
    localStorage.setItem("source", this.source);
    localStorage.setItem("set_type", this.set_type);
  
  }

  addDeckToCollection(e){
    const deckId = e.target.name;
    
    //console.log(deckId, this.user)
   this.toastr.success('The Deck has been added to your collection!', 'Success!')
  }

  setName:string = '';
  searchByName(){
    
    if(this.setName.length < 5){
      this.warningDialog("Need at lest 5 caracteres of set name")
      return false;
    }

    this.service.searchBySetName(this.setName, this.source).subscribe( data => {
        let decksFound:Deck[] = [];
        decksFound = data;

        if(decksFound == null || decksFound == undefined || decksFound.length == 0){
            this.toastr.warning("No Set found with this name")
        } else {
          this.deck = [];
          this.deck = data;
          this.toastr.success(this.deck.length + " Set(s) found")
        }
      
    }, error => {
    
      this.errorDialog("Sorry, some error happened. Try again later.");
    })

  }

  getSetTypeValue(setType:string){

    if(setType == null || setType == undefined){
      this.errorDialog("Sorry, it was not possible consult itens.");
      return false;
    }

    this.set_type = setType;
    this.deck = [];
    this.totalItens = null;

    this.getDecksInfo();
     
  }

  errorDialog(errorMessage:string){
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    })
  }
  
  warningDialog(warningMessage:string){
    this.dialog.open(WarningDialogComponent, {
      data: warningMessage
    })
  }
  
  successDialog(successMessage:string){
    this.dialog.open(SuccessDialogComponent,{
      data: successMessage
    })
  }

  
}
