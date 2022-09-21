import { RelDeckCards } from "./Rel_Deck_Cards";


export class CardSetCollectionDTO {
    angularId: string
    cardId:number;
    number:number;
    name:string;
    quantityUserHave:number;
    quantityOtherCollections:number;
    relDeckCards: RelDeckCards;
    searchedRelDeckCards: any[];
    listSetCode:string[]
    isSpeedDuel:boolean
}