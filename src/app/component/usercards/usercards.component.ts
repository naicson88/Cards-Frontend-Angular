
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Imagens } from 'src/app/classes/Imagens';
import { CardServiceService } from 'src/app/service/card-service/card-service.service';
import { GeneralFunctions } from 'src/app/Util/Utils';
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Card } from 'src/app/classes/Card';
import { SpinnerService } from 'src/app/service/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { applyLoader } from '../shared/decorators/Decorators';
import { DialogUtils } from 'src/app/Util/DialogUtils';


@Component({
  selector: 'app-usercards',
  templateUrl: './usercards.component.html',
  styleUrls: ['./usercards.component.css']
})
export class UsercardsComponent implements OnInit {
  @ViewChild('btnNew',  { static: false }) btnNew: ElementRef;

  constructor(private img: Imagens, private service: CardServiceService, private router: Router,
    private dialog: MatDialog, private spinner: SpinnerService,   private toastr: ToastrService,) { }

  cardsFromScroll = new BehaviorSubject([]);
  page: number = 1; 
  pageSize: number = 20;

  iconsMap:any;
  arrIcons = new Array();
  arrCards = new Array();
  arrCardsFromScroll = new Array();
  
  arrCardsDetails:[] = [];

  genericTypeAtual: string = 'MONSTER'

  cardname = '';

  //Serão enviadas para o tooltip
  cardImage:string;
  card:Card;

  rarities: {} = {"teste": 0};
  konamiRarities: {} 

  mainTitle = "Your Card Collection"
  dialogUtils = new DialogUtils(this.dialog);

  ngOnInit() {
    this.map();
    this.cardsByGenericType(this.genericTypeAtual);
  }

  map(){
    let iconsMap = this.img.mapCardsIcons();  
    iconsMap.forEach((img:string, value: string ) =>{
      let obj =  {'tipo': value, 'img': img}
      this.arrIcons.push(obj);
    },);
    console.log(this.arrIcons);
  }

  openSide(){
    let sideBar = (<HTMLInputElement>document.getElementById("mySidebar"));
    sideBar.style.width = "300px";
  }

  @applyLoader()
  cardsByGenericType(genericType:string){
    this.genericTypeAtual = genericType;
    const params = this.getRequestParam(this.pageSize, 0);

    if(genericType != null && genericType != " "){

      this.service.getCardsByGenericType(params, genericType).subscribe(data => {
        if(data.length > 0){
          this.arrCards = data;
          this.page = 2;
        } else {
          this.toastr.warning("No cards found with this type")
        }
          
      })

    }
  }

  cardImagem(cardId: any){
    // let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/' + cardId + '.jpg';
       let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
       return urlimg;
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

    onScroll(){
      const params = this.getRequestParam(this.pageSize, this.page);
    
      this.service.getCardsByGenericType(params, this.genericTypeAtual).subscribe(newCards => {
        this.arrCardsFromScroll = newCards;

        this.arrCardsFromScroll.forEach(card => {
          this.arrCards.push(card);
        });

        this.page = this.page + 1;
      })
    
    }

    isShowTooltip: boolean = false;
    imgTooltip: string;
    topTp;
    leftTp;

    mostrarDivCardsInfo(e, cardNumber:any){

      this.leftTp =  e.pageX + 15 + "px";
      this.topTp = + e.pageY + 15 + "px";
      this.isShowTooltip = true;
     
      this.cardImage = GeneralFunctions.cardImagem + cardNumber + '.jpg';
      this.service.findByNumero(cardNumber).subscribe(card => {this.card = card  });
    
    }
 
    mostrarImgToolTip(e){
        this.leftTp =  e.pageX + 15 + "px";
        this.topTp = + e.pageY + 15 + "px";
   
        //this.imgTooltip = img; se necessario coloca mais um argumento, o caminho da imagem
        this.imgTooltip = e.target.src;
        this.isShowTooltip = true;
     }
   
     esconderImgToolTip(){
      this.isShowTooltip = false;
    }
    
    qtdTotal:number = 0;
    @applyLoader()
    cardOfUserDetails(cardId:number) {            

        this.service.cardOfUserDetails(cardId).subscribe(data =>{
          let qtd = 0;
          this.arrCardsDetails = data;
          console.log(data)
          this.arrCardsDetails['setsWithThisCard'].forEach(element => {
            qtd += element.quantity 
          });

          this.rarities = this.arrCardsDetails['rarity']
          this.qtdTotal = qtd;

        }, error => {
          console.log(error)
        });

       
    }

    setRarityColor(rarity:string){
      return GeneralFunctions.colorRarity(rarity);
    }
    @applyLoader()
    searchCardsByName(){
              
        if(this.cardname != null && this.cardname != ""){

          if(this.cardname.length <= 3){ 
            this.dialogUtils.warningDialog("Please write at least 4 characteres");
            return false;
          }

          this.service.searchCardsByName(this.cardname).subscribe(data=>{
         
            if(Object.keys(data).length > 0 ){
              this.arrCards = data;
            }
            else{
              this.dialogUtils.errorDialog("No cards found with this name!")
            }
            
          })

        } else {
          this.dialogUtils.warningDialog("Fill the field with a Card name!");

          return false;
        }
    }

    storedCardId(event){
        const id = event.target.name;
        localStorage.setItem("idCard", id);
      }

      storeDeckId(id:any, setType:string){
         
      let modal = (document.getElementById('closeModalBtn') as HTMLElement);
      modal.click();
    //  const id = event.target.name;
      // localStorage.setItem("idDeckDetails", id);
      // localStorage.setItem("source", "USER");
      // localStorage.setItem("set_type", setType);
      GeneralFunctions.saveDeckInfoLocalStorage(id, "user", setType);
      this.router.navigate(['/user-deck-details/', 'sets.setName'])
      
    }
}


