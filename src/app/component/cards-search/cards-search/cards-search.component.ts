import { Component, Directive, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/classes/Card';
import { Imagens } from 'src/app/classes/Imagens';
import { CardServiceService } from 'src/app/service/card-service/card-service.service';
import { GeneralFunctions } from 'src/app/Util/Utils';

@Component({
  selector: 'app-cards-search',
  templateUrl: './cards-search.component.html',
  styleUrls: ['./cards-search.component.css']
})
@Directive({ selector: 'img' })
export class CardsSearchComponent implements OnInit {

  constructor(private imagens: Imagens, private cardService: CardServiceService, { nativeElement }: ElementRef<HTMLImageElement>, private router: Router) {
    const supports = 'loading' in HTMLImageElement.prototype;

    if (supports) {
      nativeElement.setAttribute('loading', 'lazy');
    }
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadRandomCards();
  }

  loading: boolean = true
  onLoad() {
    this.loading = false;

  }

  pageElement: any
  //Tooltip image
  topTp;
  leftTp;
  imgTooltip: string;
  isShowTooltip: boolean = false;
  isShowTooltipDetailed: boolean = false;
  isRandomCards: boolean = true;
  totalFound: number;


  panelOpenState = false;
  chosen: string;
  cardsFound: Card[] = [];
  cardsFromScroll: Card[] = [];
  relUserCard: any;

  criterios = new Array();

  loadRandomCards() {
    this.cardsFound = [];

    this.cardService.randomCards().subscribe(data => {
      this.cardsFound = data;
    })
  }

 
  setCardsFound(e:any){
    this.pageElement = e.get('page');
    this.criterios = e.get('criterios')
    this.isRandomCards = false;
    this.cardsFound = this.pageElement.content
    console.log(this.pageElement)
  }

  cardImagem(cardId: any) {
    let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
    return urlimg;
  }

  mostrarImgToolTip(img: string, e) {
    this.leftTp = e.pageX + 15 + "px";
    this.topTp = + e.pageY + 15 + "px";

    //this.imgTooltip = img;
    this.imgTooltip = e.target.src;
    this.isShowTooltip = true;
  }

  esconderImgToolTip() {
    this.isShowTooltip = false;
  }

  esconderImgToolTipDetailed() {
    this.isShowTooltipDetailed = false;
  }

  openCardDetail(event: any) {

    const cardNumber = event.target.name;
    if (cardNumber != null && cardNumber != "") {
      localStorage.setItem("idCard", cardNumber);
      this.cardService.setCardNumber(cardNumber);

    } else {
      console.log("Unable to consult this card, try again later.");
      return false;
    }

  }

  cardImage: string;
  card: Card;
  mostrarDivCardsInfo(e, cardNumber: any) {

    this.leftTp = e.pageX - 100 + "px";
    this.topTp = + e.pageY + 100 + "px";
    this.isShowTooltipDetailed = true;

    this.cardImage = GeneralFunctions.cardImagem + cardNumber + '.jpg';
    this.cardService.findByNumero(cardNumber).subscribe(card => { this.card = card });

  }

  onScroll() {
    if (this.isRandomCards)
      return false;
    
    if(this.cardsFound.length >= this.pageElement.totalElements)
      return false;

    const params = this.getRequestParam(this.pageElement.size, this.pageElement.number ++);

    this.cardService.searchCards(params, this.criterios).subscribe(newCards => {

      this.isRandomCards = false;
      this.totalFound = this.pageElement.totalElements

      this.cardsFromScroll = newCards;
      //this.relUserCard = GeneralFunctions.relUserCards(this.cardsFromScroll, this.cardService);

      this.cardsFromScroll.forEach(card => {
        this.cardsFound.push(card);
      });

    }, error => {
      console.log(error)
    })

  }


  getRequestParam(pageSize, page) {
    let params = {}

    if (page) {
      params[`page`] = page;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;

  }


}
