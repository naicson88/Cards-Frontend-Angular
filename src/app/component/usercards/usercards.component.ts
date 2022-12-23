
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Imagens } from 'src/app/classes/Imagens';
import { CardServiceService } from 'src/app/service/card-service/card-service.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../dialogs/warning-dialog/warning-dialog.component';
import { Card } from 'src/app/classes/Card';
import { SpinnerService } from 'src/app/service/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-usercards',
  templateUrl: './usercards.component.html',
  styleUrls: ['./usercards.component.css']
})
export class UsercardsComponent implements OnInit {
  @ViewChild('btnNew') btnNew: ElementRef;

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
  
  cardsByGenericType(genericType:string){
    this.genericTypeAtual = genericType;
    const params = this.getRequestParam(this.pageSize, 0);

    if(genericType != null && genericType != " "){
      this.spinner.show();

      this.service.getCardsByGenericType(params, genericType).subscribe(data => {
        if(data.length > 0){
          this.arrCards = data;
          this.page = 2;
        } else {
          this.toastr.warning("No cards found with this type")
        }
          
      })
      
      this.spinner.hide();
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
    
    cardOfUserDetails(cardId:number) {            
      this.spinner.show()

        this.service.cardOfUserDetails(cardId).subscribe(data =>{
          let qtd = 0;
          this.arrCardsDetails = data;
          console.log(data)
          this.arrCardsDetails['setsWithThisCard'].forEach(element => {
            qtd += element.quantity 
          });

          this.rarities = this.arrCardsDetails['rarity']
          this.qtdTotal = qtd;

          this.spinner.hide()

        }, error => {
          console.log(error)
          this.spinner.hide();
        });

       
    }

    // qtdCommon: number = 0;
    // qtdRare: number = 0;
    // qtdSuperRare:number = 0;
    // qtdUltraRare: number = 0;
    // qtdSecretRare: number = 0;

    // setQtdRarity(){
    //    if(this.arrCardsDetails['rarity']['Common'] != null && this.arrCardsDetails['rarity']['Common'] != undefined)
    //        this.qtdCommon = this.arrCardsDetails['rarity']['Common'];

    //    if(this.arrCardsDetails['rarity']['Rare'] != null && this.arrCardsDetails['rarity']['Rare'] != undefined)
    //       this.qtdRare = this.arrCardsDetails['rarity']['Rare'];

    //     if(this.arrCardsDetails['rarity']['Ultra Rare'] != null && this.arrCardsDetails['rarity']['Ultra Rare'] != undefined)
    //       this.qtdUltraRare = this.arrCardsDetails['rarity']['Ultra Rare'];
        
    //       if(this.arrCardsDetails['rarity']['Super Rare'] != null && this.arrCardsDetails['rarity']['Super Rare'] != undefined)
    //       this.qtdSuperRare = this.arrCardsDetails['rarity']['Super Rare'];

    //     if(this.arrCardsDetails['rarity']['Secret Rare'] != null && this.arrCardsDetails['rarity']['Secret Rare'] != undefined)
    //       this.qtdUltraRare = this.arrCardsDetails['rarity']['Secret Rare'];
      
    // }

    setRarityColor(rarity:string){
      return GeneralFunctions.colorRarity(rarity);
    }

    searchCardsByName(){
      
        if(this.cardname != null && this.cardname != ""){

          if(this.cardname.length <= 3){
            this.warningDialog("Please write at least 4 characteres");
            return false;
          }

          this.service.searchCardsByName(this.cardname).subscribe(data=>{
            this.spinner.show();
         
            if(Object.keys(data).length > 0 ){
              this.arrCards = data;
              this.spinner.hide();
            }
            else{
              this.spinner.hide();
                this.errorDialog("No cards found with this name!")
            }
            
          })

        } else {
          this.warningDialog("Fill the field with a card name!")

          return false;
        }
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



    storedCardId(event){
        const id = event.target.name;
        localStorage.setItem("idCard", id);
    
        const cardNumber = event.target.name;
        if(cardNumber != null && cardNumber != ""){
      
          this.service.setCardNumber(cardNumber);
        
        } else {
           console.log("Unable to consult this card, try again later.");
           return false;
        }
       
      }

      storeDeckId(id:any, setType:string){
         
         let modal = (document.getElementById('closeModalBtn') as HTMLElement);
          modal.click();
        //  const id = event.target.name;
          localStorage.setItem("idDeckDetails", id);
          localStorage.setItem("source", "USER");
          localStorage.setItem("set_type", setType);
          this.router.navigate(['/user-deck-details/', 'sets.setName'])
         
        }
}


