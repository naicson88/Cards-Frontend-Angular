import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Deck } from 'src/app/classes/Deck';
import { DeckService } from 'src/app/service/deck.service';
import {Chart} from   'chart.js';
import { CardServiceService } from 'src/app/service/card-service/card-service.service';
import { ActivatedRoute} from '@angular/router';
import { Imagens } from 'src/app/classes/Imagens';
import { SetDetailsDTO } from 'src/app/classes/SetDetailsDTO';
import { CardDetailsDTO } from 'src/app/classes/CardDetailsDTO';
import { InsideDeck } from 'src/app/classes/InsideDeck';
import { SpinnerService } from 'src/app/service/spinner.service';


@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.css']
})

export class DeckDetailComponent implements OnInit {
  @ViewChild("attrCanvas",{static: true}) elemento: ElementRef;

  deckDetails: SetDetailsDTO
  arrInsideDecksCards: InsideDeck[];
  
  quantidadePorTipo = [];
  quantidadePorEstrelas = [];
  quantidadePorAtributo: any;
  qtdPorPropriedade = [];
  infoGeralAtk = [];
  infoGeralDef = [];
  cardsValiosos =[];
  categoriaCards =[];
  countsGeneric_type: any;


  topTp;
  leftTp;
  imgTooltip: string;
  isShowTooltip: boolean = false;
  
  source:string
  set_type:string;

  imgPath: string;
  constructor(private service: DeckService, private cardService: CardServiceService, private router: ActivatedRoute, private  spinner: SpinnerService) { }

  ngOnInit() {

    this.router.data.subscribe(source =>{
      this.source = source.source;
      this.set_type= source.set_type;
    })

    window.scrollTo(0, 0);
    //this.checkPreviousUrl();
    this.loadDeckDetails();
  
  }

  //Carrega informações do deck
  loadDeckDetails(){

    this.spinner.show();
    const id = localStorage.getItem("idDeckDetails");
    const source = localStorage.getItem("source");
    const set_type = localStorage.getItem("set_type");

    this.service.getDeckDetails(id, source, set_type).subscribe(data => {

      this.deckDetails = data;
      console.log("DATA: " + JSON.stringify(this.deckDetails))
      this.arrInsideDecksCards = data['insideDeck'] //[0]['cards'];
      //console.log("Inside: " + JSON.stringify(this.arrInsideDecksCards))
      this.countsGeneric_type = data['statsQuantityByGenericType'];
      this.quantidadePorAtributo = data['statsQuantityByAttribute'];

      this.setQuantityByCardType(data['statsQuantityByType'])
      this.setQuantityByCardProperty(data['statsQuantityByProperty'])
      this.setQuantityByStars(data['statsQuantityByLevel'])
      this.setQuantityByAtk(data['statsAtk'])
      this.setQuantityByDef(data['statsDef'])
  
      this.imgPath =  this.deckDetails.imgurUrl; //Imagens.basic_img_path + this.deckDetails.setType.toLowerCase() + "\\" + this.deckDetails.nome + ".jpg"

      this.graficoAtributos();
    
      this.spinner.hide();
    })
   
  }

  

  setQuantityByCardType(types: any) {
    if(types != null || types != undefined){
      Object.entries(types).forEach(item => {
        this.quantidadePorTipo.push({
          "Tipo": item[0],
          "Quantidade": item[1]
        });
      })
    }  
  }

  setQuantityByCardProperty(properties: any) {
    if(properties != null || properties != undefined){
      Object.entries(properties).forEach(item => {
        if(item[0] != 'NORMAL'){
          this.qtdPorPropriedade.push({
            "Propriedade": item[0],
            "Quantidade": item[1]
          });
        }       
      })
    }  
  }

  setQuantityByStars(stars: any){
    if(stars != null || stars != undefined){
      Object.entries(stars).forEach(star => {
       this.quantidadePorEstrelas.push({
         "Estrelas": star[0],
         "Quantidade": star[1]
       })
      })
    }
  }

  setQuantityByAtk(atks: any){
    if(atks != null || atks != undefined){
      Object.entries(atks).forEach(atk => {
       this.infoGeralAtk.push({
         "Attack": atk[0],
         "Quantidade": atk[1]
       })
      })
    }
  }

  setQuantityByDef(defs: any){
    if(defs != null || defs != undefined){
      Object.entries(defs).forEach(def => {
       this.infoGeralDef.push({
         "Defense": def[0],
         "Quantidade": def[1]
       })
      })
    }
  }
    
  cardImagem(cardId: any){
    let urlimg = 'https://storage.googleapis.com/ygoprodeck.com/pics/' + cardId + '.jpg';
    return urlimg;
  }

    //Setar cor de fundo do Atk e do Def
    setColor(vlr:number) {
      if(vlr >= 0 && vlr <= 1900 )
         return 'rgba(0, 255, 0, 0.2)'
      else if(vlr > 1900 && vlr <= 2400 )
         return 'rgba(255, 255, 0, 0.3)'
      else
         return 'rgba(255, 64, 0, 0.3)'
    }

    setColorAtkDef(vlr:number){
      if(vlr >= 0 && vlr <= 1900 )
      return 'green'
        else if(vlr > 1900 && vlr <= 2400 )
      return 'GoldenRod'
         else
      return 'firebrick'
    }
  
    returnCardRarityImage(cardNumber:any){
      
      let card:CardDetailsDTO = this.deckDetails.insideDeck[0].cards.find(card => card.numero == cardNumber);
  
      if(card != null && card != undefined){
        if(card.card_raridade == "Ultra Rare")
           return ' ..\\..\\assets\\img\\tiposMonstros\\UR.JPG';
        else if(card.card_raridade == "Rare")
            return ' ..\\..\\assets\\img\\tiposMonstros\\r.JPG';
        else if(card.card_raridade == "Super Rare")
            return ' ..\\..\\assets\\img\\tiposMonstros\\sr.JPG';
        else (card.card_raridade == "Common")
            return null
      }
    }
  
    hasProp(obj:Object, name:string){
      if(obj != undefined && obj != null){
        return obj.hasOwnProperty(name);
      }
    }

    
  mostrarImgToolTip(img:string, e){
    this.leftTp =  e.pageX + 15 + "px";
    this.topTp = + e.pageY + 15 + "px";

    //this.imgTooltip = img;
    this.imgTooltip = e.target.src;
    this.isShowTooltip = true;
 }

 esconderImgToolTip(){
  this.isShowTooltip = false;
}

 storedCardId(event){
   
   localStorage.setItem("idCard", event.target.name);
   const cardNumber = event.target.name;
   if(cardNumber != null && cardNumber != ""){
     this.cardService.setCardNumber(cardNumber);
   
   } else {
      alert("Unable to consult this card, try again later.");
      return false;
   }
 }

 atributoImagem(atributo:string){
   switch(atributo){
     case 'WATER':
     return '..\\..\\assets\\img\\outras\\WATER.png';
     case 'EARTH':
       return '..\\..\\assets\\img\\outras\\TERRA.png';
     case 'FIRE':
       return '..\\..\\assets\\img\\outras\\FIRE.png';
     case 'LIGHT':
       return '..\\..\\assets\\img\\outras\\LUZ.png';
     case 'DARK':
       return '..\\..\\assets\\img\\outras\\DARK.png';
     case 'WIND':  
       return '..\\..\\assets\\img\\outras\\WIND.png';
     case 'Spell Card':
       return '..\\..\\assets\\img\\outras\\MAGIA.png';
     case 'Trap Card':
       return '..\\..\\assets\\img\\outras\\ARMADILHA.png';
     case 'CONTINUOUS':
       return '..\\..\\assets\\img\\outras\\Continuous.png';
     case 'FIELD':
       return '..\\..\\assets\\img\\outras\\Field.png';
     case 'QUICK_PLAY':
         return '..\\..\\assets\\img\\outras\\Quick.png';
     case 'COUNTER':
       return '..\\..\\assets\\img\\outras\\Counter.png';
     case 'EQUIP':
       return '..\\..\\assets\\img\\outras\\Equip.jpg';  
   }
   
 }

 tipoImagem(tipo:string){
   switch(tipo){
   case 'Aqua': return '..\\..\\assets\\img\\tiposMonstros\\Aqua.png';
   case 'Beast': return '..\\..\\assets\\img\\tiposMonstros\\Beast-DG.png';
   case 'Beast-Warrior': return '..\\..\\assets\\img\\tiposMonstros\\Beast-Warrior-DG.png';
   //  case 'Creator-God'  : return '..\\..\\assets\\img\\tiposMonstros\\Beast-Warrior-DG.png';
   case 'Cyberse' : return '..\\..\\assets\\img\\tiposMonstros\\Cyberse.PNG';
   case 'Dinosaur' : return '..\\..\\assets\\img\\tiposMonstros\\Dinosaur-DG.png';
   case 'Divine-Beast' : return '..\\..\\assets\\img\\tiposMonstros\\Divine-Beast-DG.png';
   case 'Dragon' : return '..\\..\\assets\\img\\tiposMonstros\\Dragon-DG.png';
   case 'Fairy': return '..\\..\\assets\\img\\tiposMonstros\\Fairy-DG.png';
   case 'Fiend' : return '..\\..\\assets\\img\\tiposMonstros\\Fiend-DG.png';
   case 'Fish' : return '..\\..\\assets\\img\\tiposMonstros\\Fish-DG.png';
   case 'Insect' : return '..\\..\\assets\\img\\tiposMonstros\\Insect-DG.png';
   case 'Machine' : return '..\\..\\assets\\img\\tiposMonstros\\Machine-DG.png';
   case 'Plant' : return '..\\..\\assets\\img\\tiposMonstros\\Plant-DG.png';
   case 'Psychic' : return '..\\..\\assets\\img\\tiposMonstros\\Psychic-DG.png';
   case 'Pyro' : return '..\\..\\assets\\img\\tiposMonstros\\Pyro-DG.png';
   case 'Reptile': return '..\\..\\assets\\img\\tiposMonstros\\Reptile-DG.png';
   case 'Rock': return '..\\..\\assets\\img\\tiposMonstros\\Rock-DG.png';
   case 'Sea Serpent': return '..\\..\\assets\\img\\tiposMonstros\\Sea_Serpent-DG.png';
   case 'Spellcaster': return '..\\..\\assets\\img\\tiposMonstros\\Spellcaster-DG.png';
   case 'Thunder': return '..\\..\\assets\\img\\tiposMonstros\\Thunder-DG.png';
   case 'Warrior': return '..\\..\\assets\\img\\tiposMonstros\\Warrior-DG.png';
   case 'Winged Beast' : return '..\\..\\assets\\img\\tiposMonstros\\Winged_Beast-DG.png';
   case 'Wyrm' : return '..\\..\\assets\\img\\tiposMonstros\\Wyrm-DG.png';
   case 'Zombie': return '..\\..\\assets\\img\\tiposMonstros\\Zombie-DG.png';
   }
 }

 graficoAtributos(){

   new Chart(this.elemento.nativeElement, {
     type: 'bar',
     data: {
         labels: ['EARTH','FIRE','WIND','DARK','LIGHT', 'WATER'],
         datasets: [{
             label: 'QUANTITY',
             data: [this.quantidadePorAtributo.EARTH, this.quantidadePorAtributo.FIRE,this.quantidadePorAtributo.WIND,this.quantidadePorAtributo.DARK, this.quantidadePorAtributo.LIGHT,
               this.quantidadePorAtributo.WATER],
             backgroundColor: [
                 'rgba(160, 82, 45, 0.7)',
                 'rgba(255, 0, 0, 0.7)',
                 'rgba(50, 205, 50, 0.7)',
                 'rgba(139, 0, 139, 0.7)',
                 'rgba(255, 255, 0, 0.7)',
                
             ],
             borderColor: [
                 'rgba(255,99,132,1)',
                 'rgba(54, 162, 235, 1)',
                 'rgba(255, 206, 86, 1)',
                 'rgba(75, 192, 192, 1)',
                 'rgba(153, 102, 255, 1)',
                 'rgba(255, 159, 64, 1)'
             ],
             borderWidth: 1
         }]
     },
     options: {
         scales: {
             yAxes: [{
                 ticks: {
                     beginAtZero:true
                 }
             }]
         }
 
     }
   });
 }

  // setCodeAndPrice(deckDetails: Deck) {
      
  //     let rel:RelDeckCards[] = deckDetails['rel_deck_cards'];

  //     this.deckDetails.cards.forEach(card => {
  //         let relationOfACard: RelDeckCards = rel.find(relation => relation.cardNumber == card.numero);

  //         if(relationOfACard != null && relationOfACard != undefined){
  //             card.price = relationOfACard.card_price;
  //             card.card_set_code = relationOfACard.card_set_code;

  //         } else {
  //           alert("Sorry, could not load the page, try again later.")
  //           throw new Error("Relation is empty");
  //         }
  //     });
  // }


  
  //Traz as propriedades contidas no deck
  // qtdPropriedades(data:Deck){
  //   let propriedades = [];
  //   for(var i = 0; i < data['cards'].length; i++){
  //     if(data['cards'][i].propriedade != null){propriedades.push(data['cards'][i].propriedade)}
  //   }
  //   //console.log(propriedades)
  //   propriedades.reduce((acc, val) => {
  //     if(!acc[val] && val != "Normal"){
  //       acc[val] =  this.qtdPorPropriedade.push({
  //         "Propriedade": val,
  //         "Quantidade": 1
  //       });
  //     }
  //     else {
  //       for(var i = 0 ; i < this.qtdPorPropriedade.length; i++) {
  //         if(this.qtdPorPropriedade[i].Propriedade == val){
  //           this.qtdPorPropriedade[i].Quantidade += 1;
  //         }
  //       }
  //     }
  //     return acc;
  //   },{})
  // }

  // qtdCategoriaCards(data:Deck){
  //   let categorias = [];
  
  //   for(var i = 0; i < data ['cards'].length; i++){
  //    if(data['cards'][i].genericType != null){categorias.push(data['cards'][i].genericType)}
  //   }
  //   let counts = {};
  //   categorias.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
  //   //this.categoriaCards.push(this.countsGeneric_type);
  //   this.countsGeneric_type.push(counts);

  // }

  // qtdEstrelas(data:Deck){
  //    let stars = new Array();
  //   for(var i = 0; i < data['cards'].length; i++){
  //     if(data['cards'][i].nivel != null){stars.push(data['cards'][i].nivel)}  
  //   }

  //   stars.reduce((acc, val) => { 
  //     if(!acc[val]){
  //       acc[val] = this.quantidadePorEstrelas.push({
  //         "Estrelas": val,
  //         "Quantidade": 1
  //       });

  //     }     
  //     else {
  //       for(var i = 0 ; i < this.quantidadePorEstrelas.length; i++) {
  //         if(this.quantidadePorEstrelas[i].Estrelas == val){
  //           this.quantidadePorEstrelas[i].Quantidade += 1;
  //         }
  //       }
  //     }
  //     return acc;     
  //   },{});

  //   this.quantidadePorEstrelas.sort((a,b) =>{
  //     if(a.Estrelas > b.Estrelas)
  //       return 1;
  //     if(a.Estrelas < b.Estrelas)
  //       return -1;

  //       return 0;
  //   })
  //   //console.log(this.quantidadePorEstrelas)
  // }


  // infoGeralAtkEDef(data:Deck){
  //   for(var i = 0; i < data['cards'].length; i++){
  //     if(data['cards'][i].atk != null && data['cards'][i].atk != undefined ){
  //       this.infoGeralAtk.push(data['cards'][i].atk)
  //     }

  //     if(data['cards'][i].def != null && data['cards'][i].def != undefined ){
  //       this.infoGeralDef.push(data['cards'][i].def)
  //     }
  //   }

  //   this.infoGeralAtk.sort((a, b) => { return a - b;});
  //   this.infoGeralDef.sort((a, b) => { return a - b;});
  // }

  //Traz o Top 3 de cards mais valioso do deck
  // cardsMaisValiosos(data:Deck){
  //   let arrCardsVal = []

  //   for(var i =0; i < data['rel_deck_cards'].length; i++){
  //     arrCardsVal.push(data['rel_deck_cards'][i])
  //   }
  
  //  arrCardsVal.sort((a,b) =>{
  //     if(a.card_price < b.card_price)
  //       return 1;
  //     if(a.card_price > b.card_price)
  //       return -1;

  //       return 0;
  //   })

  //   for(let j = 0; j <= 2; j++){
  //     let objCardsValiosos = {
  //       numero:arrCardsVal[j].cardNumber,
  //       imagem:'',
  //       preco:arrCardsVal[j].card_price
  //     }

  //     let img = data['cards'].filter((cardNumber) => {
  //       return (cardNumber.numero == objCardsValiosos.numero);
  //     })

  //     objCardsValiosos.imagem = img[0].imagem;
  //     //console.log(img)
  //     //console.log(objCardsValiosos);
  //     this.cardsValiosos.push(objCardsValiosos);
  //    // console.log(this.cardsValiosos);     
  //   }
   
  // }

  //Traz o card com maior Atk e com maior Def do deck;
  /*
  filtrosAtkDef(data: Deck[]){
     this.cardMaiorAtk = {
      nome: data['cards'][0].nome,
      imagem: data['cards'][0].imagem,
      atk: data['cards'][0].atk
    }

    this.cardMaiorDef ={
      nome: data['cards'][0].nome,
      imagem: data['cards'][0].imagem,
      def: data['cards'][0].def
    }
    
    for(var i =0; i < data['cards'].length; i++){
      if(data['cards'][i].atk > this.cardMaiorAtk.atk){
        this.cardMaiorAtk.atk = data['cards'][i].atk;
        this.cardMaiorAtk.nome = data['cards'][i].nome;
        this.cardMaiorAtk.imagem = data['cards'][i].imagem;
      }

      if(data['cards'][i].def > this.cardMaiorDef.def && data['cards'][i].def != undefined){
        this.cardMaiorDef.def = data['cards'][i].def;
        this.cardMaiorDef.nome = data['cards'][i].nome;
        this.cardMaiorDef.imagem = data['cards'][i].imagem;
      }
    }
    //console.log(this.cardMaiorAtk, this.cardMaiorDef)
   // data2['cards'].sort(function (a, b){ a.atk - b.atk})
  
  } */

  // Verifica os dados do Deck para preenchimento das estatisticas
  // estatisticasDeck(data: Object){

  //   let arr = [];   
    
  //   for(var i = 0; i < data['cards'].length; i++){
  //     if(data['cards'][i].nivel != null){arr.push(data['cards'][i].tipo.name)}  

  //     if(data['cards'][i].atributo.name == 'DARK'){ this.qtd_total_DARK++;} 
  //     if(data['cards'][i].atributo.name  == 'FIRE'){ this.qtd_total_FIRE++;}
  //     if(data['cards'][i].atributo.name  == 'WATER'){ this.qtd_total_WATER++;}
  //     if(data['cards'][i].atributo.name  == 'EARTH'){ this.qtd_total_EARTH++;}
  //     if(data['cards'][i].atributo.name  == 'WIND'){ this.qtd_total_WIND++;}
  //     if(data['cards'][i].atributo.name  == 'LIGHT'){ this.qtd_total_LIGTH++;}
  //   }

  //       arr.reduce((acc, val) => {
    
  //         if(!acc[val]){
  //           acc[val] = this.quantidadePorTipo.push({
  //             "Tipo": val,
  //             "Quantidade": 1
  //           });

  //         }     
  //         else {
  //           for(var i = 0 ; i < this.quantidadePorTipo.length; i++) {
  //             if(this.quantidadePorTipo[i].Tipo == val){
  //               this.quantidadePorTipo[i].Quantidade += 1;
  //             }
  //           }
  //         }
  //         return acc;     
  //       },{});
  // }

  


}
