import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Deck } from '../classes/Deck';
import { Observable } from 'rxjs';
import { HandleErros } from '../Util/HandleErros';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { KonamiDeck } from '../classes/KonamiDeck';
import { SetDetailsDTO } from '../classes/SetDetailsDTO';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  deck: Deck

  constructor(private http: HttpClient, private router: Router ) {}

  base_url = environment.devCardsMain

    public getDecks(params, set_type:string, source:string): Observable<any>{
      if(source == "KONAMI"){ // Se for Konami set
         
        return  this.http.get(this.base_url+`/decks/get-sets?size=${params.size}&page=${params.page}&setType=${set_type}`)
        .pipe(
          catchError(HandleErros.handleError)
        )

      } else { //Se forem sets do usuário
          return  this.http.get(this.base_url+`/userDeck/sets-of-user?size=${params.size}&page=${params.page}&setType=${set_type}`)
          .pipe(
            catchError(HandleErros.handleError)
          )
      }
   
  } 

  public getDeckDetails(id:any, source:string, set_type:string ) {

    return this.http.get<SetDetailsDTO>(this.base_url+`/decks/set-details?id=${id}&source=${source}&setType=${set_type}`) 
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

  public editDeck(id:any, setSource:string) {

    return this.http.get<Deck>(this.base_url+`/userDeck/edit-deck?id=${id}&setSource=${setSource}`) 
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

  public addDeckToUsersCollection(setId:number){
    return this.http.get<any>(this.base_url+`/userDeck/add-deck-to-user-collection/${setId}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public addSetToUsersCollection(setId:number){
    return this.http.get<any>(this.base_url+`/user-setcollection/add/${setId}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public removeDeckToUsersCollection(setId:number){
    return this.http.get<any>(this.base_url+`/userDeck/remove-set-to-user-collection/${setId}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  public removeSetToUsersCollection(setId:number){
    return this.http.get<any>(this.base_url+`/user-setcollection/remove/${setId}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }


  public manegeDeckAndCardsOfUserCollection(deckId: number, flagAddOrRemove:string){
    return this.http.get<any>(this.base_url+`/decks/add-deck-to-user-collection/${deckId}/${flagAddOrRemove}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  // public relUserDeck(decksIds:number[]) {
  //   return this.http.get<any>(this.base_url+`/userDeck/rel-user-decks?decksIds=${decksIds}`)
  //   .pipe(
  //     catchError(HandleErros.handleError)
  //   )
  // }

  public saveUserDeck(deck:Deck): Observable<HttpResponse<Deck>> {
    return this.http.post<Deck>(this.base_url+`/userDeck/save-userdeck`, deck, {observe:'response'}).pipe(
      catchError(HandleErros.handleError)
    )
  }

  public searchBySetName(name:string, source:string){
      return this.http.get<any>(this.base_url+`/decks/search-by-set-name?setName=${name}&source=${source}`)
        .pipe(
          catchError(HandleErros.handleError)
        )
  }

  public createNewKonamiDeck(konamiDeck: KonamiDeck) {
    
    return this.http.post<KonamiDeck>("http://localhost:8082/v1/admin/deck/new-deck", konamiDeck)
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

  public autcompleteSets(source:string) {
    
    return this.http.get<any>(this.base_url+`/decks/autocomplete-sets?source=${source}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

}
