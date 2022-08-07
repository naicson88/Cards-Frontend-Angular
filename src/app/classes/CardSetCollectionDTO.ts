import { RelDeckCards } from "./Rel_Deck_Cards";


export class CardSetCollectionDTO {
    angularId: number
    cardId:number;
    number:number;
    name:string;
    quantityUserHave:number;
    quantityOtherCollections:number;
    relDeckCards: RelDeckCards;
    searchedRelDeckCards: any[];
    listSetCode:string[]
}