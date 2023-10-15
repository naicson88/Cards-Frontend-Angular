import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { catchError } from "rxjs/operators"
import { HandleErros } from "src/app/Util/HandleErros"
import { environment } from "src/environments/environment"

@Injectable({
    providedIn: 'root'
  })
  export class PriceUpdateServices {

     constructor(private http: HttpClient, private router: Router ) {}
     base_url = environment.devCardsAdmin

     public updateSetPrice(name:string) {
        return this.http.get<[number]>(this.base_url+`/price/update-deck-price?deckName=${name}`) 
        .pipe(
          catchError(HandleErros.handleError)
        )  
      }
  }