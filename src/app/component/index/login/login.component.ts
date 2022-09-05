import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { retryWhen } from 'rxjs/operators';
import { LoginRequest } from 'src/app/classes/LoginRequest';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt;
  private badRequest: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private active: ActivatedRoute,
    private spinner: SpinnerService,
    private dialog: MatDialog

  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  

  get f() { return this.form.controls }

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

  errorDialog(errorMessage:string){
    this.dialog.open(ErrorDialogComponent, {
      data: errorMessage
    })
  }

}
