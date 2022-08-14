import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { HandleErros } from "src/app/Util/HandleErros";

@Injectable({
    providedIn: 'root'
  })
export class TransferService {
    
    constructor(private http: HttpClient, private router: Router ) {}
  
    base_url = "http://localhost:8080/yugiohAPI"

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

}