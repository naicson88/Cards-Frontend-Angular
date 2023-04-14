import { RelDeckCards } from "../Rel_Deck_Cards";

export class SetEditDTO {
    id:number;
    nome:string;
    lancamento: Date;
    setType: string;
    isSpeedDuel: string;
    isBasedDeck:boolean;
    imagem:string
    setCode:string
    description:string
    insideDecks: SetEditDTO[]
    relDeckCards: RelDeckCards[]
}