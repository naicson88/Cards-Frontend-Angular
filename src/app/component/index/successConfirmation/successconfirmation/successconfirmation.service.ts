import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HandleErros } from 'src/app/Util/HandleErros';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuccessconfirmationService {
  
  constructor(private http: HttpClient ) {}

  base_url = environment.devCardsMain

  
  validTokenEmailConfirmation(token:string){
    return this.http.get<any>(this.base_url+`/auth/token-validation?token=${token}`)
    .pipe(
      catchError(HandleErros.handleError)
    )
  }

  
}
