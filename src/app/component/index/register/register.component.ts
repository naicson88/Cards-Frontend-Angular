import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog/info-dialog.component';
import { SuccessDialogComponent } from '../../dialogs/success-dialog/success-dialog.component';
import { WarningDialogComponent } from '../../dialogs/warning-dialog/warning-dialog.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRote: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: SpinnerService
    
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      email: ['', Validators.required]
    });
  }
  get f() {
    return this.form.controls
  }

  isFieldInvalid(field: string){
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (!this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  register(){
    this.spinner.show();
    let validFields:string = this.validFields();
    if(validFields != ""){
      alert(validFields) 
      return false;
    }

    this.authService.signup(
      {
        email: this.f.email.value,
        password: this.f.password.value,
        username: this.f.username.value
      }
    ).subscribe(response => {
      
      console.log(response);
      this.router.navigate(['confirm-email'], {queryParams: {email: this.f.email.value}})
    }, error =>{
      console.log(error);
      this.warningDialog(error.msg)
    })
  }

  validFields():string{
    if(this.f.username.value == "" || this.f.username.value.length < 3){
      return 'User Name too short!';
    }

    if(this.f.password.value == "" || this.f.password.value.length < 6){
      return 'Password too short!';
    }

    if(this.f.email.value == "" || this.f.password.value.length < 6){
      return 'Invalid Email';
    }

    if(this.f.password.value != this.f.confirm.value){
      return 'Password not match confirmation!';
    }

    return "";

  }

  return(){
    this.router.navigate(['/index'])
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
