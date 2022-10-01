import { CardSetCollectionDTO } from "./CardSetCollectionDTO";

export class UserSetCollectionDTO {
   
    id:number;
    name:string;
    image:string
    totalPrice:string;
    rarities:any;
    setCodes:string[];
    setType:string
    basedDeck:any;
    cards:CardSetCollectionDTO[];
}