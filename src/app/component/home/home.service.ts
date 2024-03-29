import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HandleErros } from 'src/app/Util/HandleErros';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, private router: Router ) {}

  base_url = environment.devCardsMain

  public loadHomeInfo() {
    return this.http.get<any>(this.base_url+`/home/info`) 
    .pipe(
      catchError(HandleErros.handleError)
    )   
  }


}
