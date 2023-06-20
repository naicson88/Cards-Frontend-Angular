import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HandleErros } from 'src/app/Util/HandleErros';
import { catchError } from 'rxjs/operators';
import { ApiResponseDTO } from 'src/app/classes/DTO/ApiResponseDTO';
import { ManageAccount } from './account-manager.component';

@Injectable({
    providedIn: 'root'
  })
  export class AccountManageService {
  
    constructor(private http: HttpClient, private router: Router ) {}
  
    base_url = environment.devCardsMain

    public changeAccountInformation(account: ManageAccount) {
        return this.http.post<ApiResponseDTO>(this.base_url+`/auth/change-account-information`, account) 
        .pipe(
          catchError(HandleErros.handleError)
        )
         
      }

  }