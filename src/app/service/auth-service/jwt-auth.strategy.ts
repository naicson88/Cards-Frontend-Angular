

import { Observable, of } from "rxjs";
import { Token } from "src/app/classes/Token";
import { User } from "src/app/classes/User";
import { AuthStrategy } from "./auth.strategy";

export class JwtAuthStrategy implements AuthStrategy<Token> {
   
    private readonly JWT_TOKEN = 'JWT_TOKEN';
   
    doLoginUser(token: Token): void { 
       console.log(token)
       sessionStorage.setItem(this.JWT_TOKEN, token.accessToken);
    }
    doLogoutUser(): void {
        sessionStorage.removeItem(this.JWT_TOKEN);
    }
    getCurrentUser(): Observable<User> {
       const token = this.getToken();
       if(token){
           const encodedPayload = token.split('.')[1];
           const payload = window.atob(encodedPayload);
           return of(JSON.parse(payload))
       }else {
           return of (undefined)
       }
    }

    getToken(){
       return  sessionStorage.getItem(this.JWT_TOKEN);
    }
} 