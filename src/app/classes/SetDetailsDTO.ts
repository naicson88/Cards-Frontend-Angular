import { InsideDeck } from "./InsideDeck"

export class SetDetailsDTO {

    id:number;
    nome:string;
    nomePortugues:string;
    qtd_cards:number;
    qtd_comuns:number;
    qtd_raras: number;
    qtd_super_raras: number;
    qtd_ultra_raras: number;
    qtd_secret_raras: number;
    lancamento: Date;
    setType: string;
    dt_criacao: Date
    isSpeedDuel: string;
    insideDeck: InsideDeck;
    statsQuantityByAttribute: [];
    statsQuantityByLevel: [];
    statsQuantityByProperty: [];
    statsQuantityByGenericType: [];
    statsAtk: [];
    statsDef: [];
}