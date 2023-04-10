import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { HandleErros } from "src/app/Util/HandleErros";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })

  export class DashboardService {

    constructor(private http: HttpClient, private router: Router) {}

    base_url = environment.devCardsMain

    public getStats() {
        return this.http.get<any>(this.base_url+`/decks/set-stats?id=2534&source=KONAMI&setType=DECK`)
        .pipe(
            catchError(HandleErros.handleError)
        )
    }
  }