import { CardRarityDTO } from "./CardRarityDTO";

export class CardDetailsDTO {
    id: number;
    numero: number;
    categoria: string;
    nome: string
    atributo:any[]
    propriedade: string;
    nivel: number;
    atk: number;
    def: number;
    descricao: string;
    imagem: string;
    escala: null;
    descr_pendulum: string;
    descr_pendulum_pt: string;
    qtd_link: number;
    sets: any;
    genericType: string;
    tipo: []
    archetype: [];
    registryDate: Date;
    alternativeCardNumber: number;
    cardNumber: number;
    cardSetCode: string;
    card_price: number;
    card_raridade: string;
    isSideDeck: boolean;
    isSpeedDuel: boolean;
    listCardRarity: CardRarityDTO[];
}