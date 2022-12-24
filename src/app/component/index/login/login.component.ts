import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { retryWhen } from 'rxjs/operators';
import { LoginRequest } from 'src/app/classes/LoginRequest';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { GeneralFunctions } from 'src/app/Util/GeneralFunctions';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog/info-dialog.component';
import { SuccessDialogComponent } from '../../dialogs/success-dialog/success-dialog.component';
import { WarningDialogComponent } from '../../dialogs/warning-dialog/warning-dialog.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  formResend: FormGroup;
  private formSubmitAttempt;
  private badRequest: boolean;



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private spinner: SpinnerService,
    private dialog: MatDialog

  ) { }

  resend:string = "";
  isLogin: boolean = false;
  isResend: boolean = false;
  ngOnInit() {

    this.checkFormType();

    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.formResend = this.fb.group({
      emailResend: ['', Validators.required],
    });
  }

  checkFormType(){
    let url = window.location.href;

    if(url.includes("resend"))
      this.isResend = true;
    else
      this.isLogin = true;
  }

  get f() { return this.form.controls }

  get fr(){return this.formResend.controls}

  isFieldInvalid(field: string) {
    this.verifyBadRequest();
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (!this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    this.spinner.show();
    
    const loginRequest: LoginRequest = {
      username: this.f.userName.value,
      password: this.f.password.value
    };

    this.authService.login(loginRequest).subscribe(user => {
      this.router.navigate([this.authService.INITIAL_PATH]);
    }, error => {
      this.spinner.hide();
      console.log(error);
        if(error.error.msg == "Bad credentials"){
          this.errorDialog("Invalid Username / Password");
        } else {
          this.errorDialog("Something bad happened, try again later!")
        }
    }); 

    this.spinner.hide();
  }

  verifyBadRequest() {
    let url = window.location.href;

    if (url.includes('/login;data=true')) {
      this.badRequest = true;
    }
  }

  clean()
  {
    this.badRequest = false;
  }

  return(){
    this.router.navigate(['/index'])
  }

  resendPassword(){

    let email = this.fr.emailResend.value

    if(!GeneralFunctions.validateEmail(email)){
      this.errorDialog("Please inform a valid Email!")
      return false;
    }

    if(email){
      this.spinner.show()
      this.authService.resendPassword(email).subscribe(response => {
       console.log(response)

        this.spinner.hide();
        this.successDialog("Email sent to " + email + ", access to change your password!");
        this.return()
      }, error => {
 
        this.spinner.hide();      
        this.errorDialog(error.error.msg)   
      })
    }
    else {
      this.errorDialog("Please fill a valid email!");
    }
  }


  errorDialog(errorMessage:string){
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    })
  }
  
  warningDialog(warningMessage:string){
    this.dialog.open(WarningDialogComponent, {
      data: warningMessage
    })
  }
  
  infoDialog(infoMessage:string){
    this.dialog.open(InfoDialogComponent, {
      data: infoMessage
    })
  }
  
  successDialog(successMessage:string){
    this.dialog.open(SuccessDialogComponent,{
      data: successMessage
    })
  }

}
