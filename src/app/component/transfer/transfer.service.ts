import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { UserSetCollectionDTO } from "src/app/classes/UserSetCollectionDTO";
import { HandleErros } from "src/app/Util/HandleErros";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
export class TransferService {
    
    constructor(private http: HttpClient, private router: Router ) {}
  
    base_url = environment.devCardsMain

    public getSetCollectionNames(setType:string) {
        return this.http.get<any>(this.base_url+`/user-setcollection/setsname-by-settype/${setType}`) 
        .pipe(
          catchError(HandleErros.handleError)
        )       
      }

   public getDecksNames(){
    return this.http.get<any>(this.base_url+`/userDeck/get-all-decksname`)
        .pipe(
            catchError(HandleErros.handleError)
        )
   }
   
   public getDeckAndCardsForTransfer(deckId:number){
    return this.http.get<any>(this.base_url+`/userDeck/deck-transfer?deckId=${deckId}`)
        .pipe(
            catchError(HandleErros.handleError)
        )
   }

   public getSetCollectionForTransfer(setId:number){
    return this.http.get<any>(this.base_url+`/user-setcollection/set-collection-for-transfer?setId=${setId}`)
        .pipe(
            catchError(HandleErros.handleError)
        )
   }

   public saveSets(setsToBeSaved: UserSetCollectionDTO[]) {
        return this.http.post<any>(this.base_url+`/user-setcollection/save-transfer`, setsToBeSaved)
        .pipe(
            catchError(HandleErros.handleError)
        )
  }

}