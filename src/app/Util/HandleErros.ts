
import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

export abstract class HandleErros  {
    static router: Router;

    constructor(router: Router){}

    public static handleError(error: HttpErrorResponse) {
    
        if(error.error instanceof ErrorEvent){
            console.log(" An error occurred", error.error.message);
        } else {
            console.log(`Backend returned code  ${error.status} ` + ` body was: ${JSON.stringify(error.error)} `); 
        }

        if (error.status === 401) {
            this.router.navigate(["/login"]);
          }

        else if(error.status === 500){
            this.router.navigate(["/error-page", 500])
        }
    
        else if(error.status === 404){
            this.router.navigate(["error-page", 404])
        }

        return throwError(error);
    
    }

  
   
}
