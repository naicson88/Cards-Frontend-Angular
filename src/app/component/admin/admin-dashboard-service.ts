import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { KonamiDeck } from "src/app/classes/KonamiDeck";
import { SetCollection } from "src/app/classes/SetCollection";
import { HandleErros } from "src/app/Util/HandleErros";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class AdminDashboardService {

      
    constructor(private http: HttpClient, private router: Router ) {}

    base_url:string = environment.cardsAPIGateway; //"http://localhost:8082/v1/admin/deck/new-deck"
 
  public createNewKonamiDeck(konamiDeck: KonamiDeck) {
    
    return this.http.post<KonamiDeck>(this.base_url+"/v1/admin/deck/new-deck", konamiDeck)
    .pipe(
      catchError(HandleErros.handleError)
    )
     
  }

  public createNewSetCollection(setCollection: SetCollection) {
    return this.http.post<SetCollection>(this.base_url+"/v1/admin/set-collection/new-collection", setCollection)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }
  
  }