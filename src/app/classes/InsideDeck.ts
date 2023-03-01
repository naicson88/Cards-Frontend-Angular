
import { CardDetailsDTO } from "./CardDetailsDTO";
import { RelDeckCards } from "./Rel_Deck_Cards";

export class InsideDeck{
    insideDeckName: string;
    insideDeckImage: string;
    cards: CardDetailsDTO[];
    relDeckCards: RelDeckCards[];
}