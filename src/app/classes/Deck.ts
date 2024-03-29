import { Card } from "./Card";
import { RelDeckCards } from "./Rel_Deck_Cards";
import { SetCollection } from "./SetCollection";


export class Deck {
    id: number;
    imagem: string;
    nome: string
    nomePortugues: string
    cards: Card[];
    isKonamiDeck:string;
    lancamento:Date;
    setType:string;
    rel_deck_cards:RelDeckCards[]
    setCollection: SetCollection[]
    imgurUrl:string;
    isSpeedDuel:boolean
}