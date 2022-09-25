import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { DeckCollection } from "src/app/classes/DeckCollection";
import { KonamiDeck } from "src/app/classes/KonamiDeck";
import { SetCollection } from "src/app/classes/SetCollection";
import { HandleErros } from "src/app/Util/HandleErros";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class AdminDashboardService {


      
    constructor(private http: HttpClient, private router: Router ) {}

    base_url:string = environment.devCardsAdmin //environment.cardsAPIGateway; 
    base_url_main = environment.devCardsMain
 
  public createNewKonamiDeck(konamiDeck: KonamiDeck) {
    
    return this.http.post<KonamiDeck>(this.base_url+"/deck/new-deck", konamiDeck)
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

  createNewDeckCollection(deck: DeckCollection) {
    return this.http.post<KonamiDeck>(this.base_url+"/deck/new-deck-collection", deck)
    .pipe(
      catchError(HandleErros.handleError)
    )    
  }

  public createNewSetCollection(setCollection: SetCollection) {
    return this.http.post<SetCollection>(this.base_url+"/set-collection/new-collection", setCollection)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public getSetCollectionNames(setType:string) {
    return this.http.get<any>(this.base_url_main+`/collection/setsname-by-settype/${setType}`) 
    .pipe(
      catchError(HandleErros.handleError)
    )       
  }

  public getDecksNames(collectionDecks: boolean) {
    return this.http.get<any>(this.base_url_main+`/decks/get-all-decksname?collectionDeck=`+collectionDecks) 
    .pipe(
      catchError(HandleErros.handleError)
    )       
  }

    public addNewCardToDeck(cardToBeAdd:any) {
      return this.http.post<any>(this.base_url+"/card/add-new-card-to-deck", cardToBeAdd) 
      .pipe(
        catchError(HandleErros.handleError)
      )       
    }
  }