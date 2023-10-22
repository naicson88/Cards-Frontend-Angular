import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable, OnInit } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { AUTH_STRATEGY } from "./auth.strategy";
import { configg } from "./config";
import { JwtAuthStrategy } from "./jwt-auth.strategy";
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor, OnInit {

  constructor(private router: Router, private authService: AuthService, @Inject(AUTH_STRATEGY) private jwt: JwtAuthStrategy) { }
 async ngOnInit() {
    
  }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (configg.auth === 'token' && this.jwt && this.jwt.getToken()) {
      request = this.addToken(request, this.jwt.getToken());
    }
    
    let url = window.location.href;

    if ((this.jwt.getToken() === null || this.jwt.getToken() === "") && !url.includes("/login")  
        && !url.includes("/register") && !url.includes("/confirmation")) {
        this.authService.logout();
        this.router.navigate(['/index'])
    }

    if(url.includes("/index") && this.jwt.getToken() != null  && this.jwt.getToken() != ""){
      this.router.navigate(['/home'])
    }
   
    let clonedRequest = null;
  
  //  var ip = sessionStorage.getItem("Address") === null ? 'NO IP' : sessionStorage.getItem("Address")
  //  if(ip === 'NO IP' && (!url.includes("/login") && !url.includes("/register"))) {
  //    this.authService.doLogoutAndRedirectToLogin();
  //    return null;
  //  }  

    // if(request.url != "http://api.ipify.org/?format=json")
    //   request = request.clone({headers: request.headers.append('X-Forwarded-For', ip)});
  
    return next.handle(request).pipe(catchError(error => {
      debugger
      if(error.error.msg == 'Bad credentials'){
        this.router.navigate(["/login", {data: true}])
      }

      else if (error.status === 401) {
        this.authService.doLogoutAndRedirectToLogin();
      }

      else if (error.status === 500 && error.statusText != "Unknown Error") {
        this.router.navigate(["/error-page", 500])
      }

      else if (error.statusText == "Unknown Error") {       
        this.router.navigate(["/maintenence"])
      }

      else if (error.status === 404) {
        this.router.navigate(["error-page", 404])
      }

      return throwError(error);
    }));

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { 'Authorization': `Bearer ${token}` }
    });
  }

}