import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/service/spinner.service';
import { AdminDashboardService } from '../../admin-dashboard-service';

@Component({
  selector: 'app-admin-add-card-deck',
  templateUrl: './admin-add-card-deck.component.html',
  styleUrls: ['./admin-add-card-deck.component.css']
})
export class AdminAddCardDeckComponent implements OnInit {

  constructor(private adminService: AdminDashboardService, private http: HttpClient, private toastr: ToastrService,
    private spinner: SpinnerService) { }

  listAllDecks: [] = [];

  ngOnInit() {
    this.createFormDeck(new AddNewCardToDeck())
    this.getAllDecks();
    console.log(this.listAllDecks)
  }

  formAddCard: FormGroup;


  createFormDeck(newCardToDeck: AddNewCardToDeck){
    this.formAddCard = new FormGroup({
      name: new FormControl(newCardToDeck.name),
      number: new FormControl(newCardToDeck.number),
      deckId: new FormControl(newCardToDeck.deckId),
      rarity: new FormControl(newCardToDeck.rarity),
      rarityCode: new FormControl(newCardToDeck.rarityCode),
      rarityDetails: new FormControl(newCardToDeck.rarityDetails),
      price: new FormControl(newCardToDeck.price),
      cardSetCode: new FormControl(newCardToDeck.cardSetCode),
      isSpeedDuel: new FormControl(newCardToDeck.isSpeedDuel),
    })
  } 

  onSubmitAddNewCardToDeck(){  
    this.adminService.addNewCardToDeck(this.formAddCard.value).subscribe(result => {
      console.warn(result);
      this.toastr.success("Deck information sent to Queue");
      this.formAddCard.reset();
    }, error =>{
      console.log(error.msg)
    })
    
  }

  getAllDecks(){ 
    this.spinner.show();
    this.adminService.getDecksNames(true).subscribe(names => {
      console.log(names)
      this.listAllDecks = names;     
      this.spinner.hide();
    }, error => {  
      this.spinner.hide();
      alert("It was not possible search sets")
    })
  }

}

class AddNewCardToDeck {
      name: string;
      number : number ;
      deckId: number;
      rarity: string;
      rarityCode:string;
      rarityDetails: string;
      price: number;
      cardSetCode:string;
      isSpeedDuel:boolean;
      isBasedDeck:boolean;

}
