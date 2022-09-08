import { Serializer } from "@angular/compiler";
import { Card } from "../classes/Card";
import { CardServiceService } from "../service/card-service/card-service.service";
import { ExtraDeckTypes } from "./enums/ExtraDeckTypes";


export abstract class GeneralFunctions  {

    public static cardImagem:string = 'https://storage.googleapis.com/ygoprodeck.com/pics/';
    

    public static relUserCards(cardsFound: Card[], service: CardServiceService) {

        let cardNumbers = [];
        let relUserCard:any[];

        for(var i = 0; i < cardsFound.length; i++){
            if(cardsFound[i]['numero'] != null){cardNumbers.push(cardsFound[i]['numero'] )}
           }
           
            service.relUserCards(cardNumbers).subscribe(rel =>{
            relUserCard = rel;
          
            cardsFound.forEach( comp => {
              relUserCard.map( e => {
                if(e.cardNumero === comp.numero){
                  Object.assign(comp, {"qtd": e.qtd})
                }
              })
            })
            return relUserCard;
          });         
    }

    public static isExtraDeckCard(cardType:string) {
      
      if((<any>Object).values(ExtraDeckTypes).includes(cardType))
          return true;
      else
          return false;
    }

    public static formatCurrencyNumber(value:number){
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      })

      return formatter.format(value);
    }

    public static rarity(raridade:string):string {
        if(raridade == null || raridade == undefined)
          return null;
        if(raridade == 'Common')
            return "common"     
        if(raridade == 'Rare')
          return "rare";       
        if(raridade == 'Super Rare')
          return "super_rare";    
        if(raridade == 'Ultra Rare')
          return "ultra_rare";           
    }

    public static colorRarity(raridade:string):string {
      if(raridade == null || raridade == undefined)
        return null;
      if(raridade == 'Common')
          return "color-common"     
      else if(raridade == 'Rare')
        return "color-rare";       
      else if(raridade == 'Super Rare')
        return "color-super-rare";    
      else if(raridade == 'Ultra Rare')
        return "color-ultra-rare";
      else if(raridade == 'Secret Rare')
        return "color-secret-rare";
      else{
          return "color-common"
      }          
  }

  public static validateEmail(email)  {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


}
