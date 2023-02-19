import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HandleErros } from '../../../Util/HandleErros'
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class ChangeArtService {

     constructor(private http: HttpClient, private router: Router ) {}
     base_url = environment.devCardsMain

     public getAlternativeNumbers(cardId:number) {
        return this.http.get<[number]>(this.base_url+`/cards/get-alternative-numbers?cardId=${cardId}`) 
        .pipe(
          catchError(HandleErros.handleError)
        )  
      }
  }