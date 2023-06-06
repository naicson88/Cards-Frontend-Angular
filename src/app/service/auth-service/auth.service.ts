import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { User } from 'src/app/classes/User';
import { AuthStrategy, AUTH_STRATEGY } from './auth.strategy';
import { LoginRequest } from 'src/app/classes/LoginRequest';
import { tap, map, catchError, subscribeOn } from 'rxjs/operators';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { configg } from './config';
import { HandleErros } from 'src/app/Util/HandleErros';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly JWT_TOKEN = 'JWT_TOKEN';

  public readonly LOGIN_PATH ='/login';
  public readonly CONFIRM_PATH = '/confirm';
  public readonly INITIAL_PATH = '/home';

  userRole:string
  username: any;
  user: any;
  base_url = environment.devCardsMain
  constructor(
  
    private router: Router,
    private http: HttpClient,
    @Inject(AUTH_STRATEGY) private auth: AuthStrategy<any>
  ) { }

  signup(user: User): Observable<void> {
    return this.http.post<any>(this.base_url+`auth/signup`, user);
  }

  login(loginRequest: LoginRequest): Observable<User> {
    
    return this.http.post<any>(`${configg.authUrl}/auth/login`, loginRequest)
    .pipe(tap(user => {
        this.auth.doLoginUser(user)
       // localStorage.setItem('currentUser', JSON.stringify(user.roles[0]));
    }));

  }

  consultarUsuarioLogado(username: string){
    return  this.http.get<User>(`${configg.authUrl}/User/consulta-usuario/${username}`);
  }
  /*logout(){
    return this.http.get<any>(`${configg.authUrl}/auth/logout`)
      .pipe(tap(() => this.doLogoutUser()))
  }*/
  //Logout JWT
  logout(){
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('userRole');
    this.router.navigate(['/index'])
  }

  private doLogoutUser() {
    this.auth.doLogoutUser();
  }
    
  // isLoggedIn$(): Observable<boolean> {
  //   var subject = new Subject<boolean>();
 
  //    this.auth.getCurrentUser().subscribe(user =>{
      
  //     if(user == null || user == undefined)
  //         subject.next(false)
  //     else
  //         subject.next(true)
  //   });    

  //   return subject.asObservable();
  
  // }
  isLoggedIn$(): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  getCurrentUser$(): Observable<User>{
    return this.auth.getCurrentUser();
  }

  doLogoutAndRedirectToLogin() {
    this.doLogoutUser();
    this.router.navigate(['/login']);
  }

  getUser(): Observable<User>{
    
    this.getCurrentUser$().subscribe(user=>{
      this.username = user  
    })

     return  this.user = this.consultarUsuarioLogado(this.username.sub);

  }


  resendPassword(email:string){
    return this.http.get<any>(this.base_url+`/auth/resend-password?email=${email}`)
  }

  confirmPassword(pass:string){
    return this.http.get<any>(this.base_url+`/auth/confirm-password?pass=${pass}`)
  }

  validTokenToChangePassword(token: string) {
    return this.http.get<any>(this.base_url+`/auth/check-token-password?token=${token}`)
  }

  changePassword(user: any) {
    return this.http.post<any>(this.base_url+'/auth/change-password?token', user);
  }

  checkServerStatus(){
    return this.http.get<any>(this.base_url+"actuator/health")
  }

  generalSerach(param:string){
    return this.http.get<any>(this.base_url+`/home/general-search?param=${param}`)
  }

  getIpAddress(): Observable<string> {
    return this.http.get<any>("http://api.ipify.org/?format=json").pipe(map(res => res.ip));
  }
}



