import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { Card } from "src/app/classes/Card";
import { HandleErros } from "src/app/Util/HandleErros";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class DeckDetailUserService {
  
  
    card: Card;
    private cardNumber: number;
  
    constructor(private http: HttpClient) {}
    
    base_url = environment.devCardsMain

    public randomCardsDetailed(){
        return this.http.get<Card[]>(this.base_url+"/cards/randomCardsDetailed")
        .pipe(
          catchError(HandleErros.handleError)
        )
      }

  }