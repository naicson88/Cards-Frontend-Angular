import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { UserSetCollectionDTO } from "src/app/classes/UserSetCollectionDTO";
import { HandleErros } from "src/app/Util/HandleErros";

@Injectable({
    providedIn: 'root'
  })
  export class UserSetCollectionService {
    userSet: UserSetCollectionDTO

    constructor(private http: HttpClient, private router: Router ) {}
  
    base_url = "http://localhost:8080/yugiohAPI"

    public getSetCollection(setId:any) {

        return this.http.get<UserSetCollectionDTO>(this.base_url+`/user-setcollection/consult/${setId}`) 
        .pipe(
          catchError(HandleErros.handleError)
        )
         
      }
  }