export class RaritiesDTO {
    Common:string;
	Rare:string;
	Super_Super: string;
	Ultra_Rare:string;
	Secret_Rare:string; 		
	Ultimate_Rare:string;
	Gold_Rare:string
	Parallel_Rare:string
	Ghost_Rare:string 

	raritiesList() {
		return ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Ultimate Rare', 'Gold Rare', 'Parallel Rare', 'Ghost Rare']
	}
}