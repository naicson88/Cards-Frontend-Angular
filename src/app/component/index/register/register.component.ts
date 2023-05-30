import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/classes/User';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { applyLoader } from '../../shared/decorators/Decorators';
import { DialogUtils } from 'src/app/Util/DialogUtils';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  formChange: FormGroup
  token:string = "";
  user: User = new User();
  private formSubmitAttempt;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: SpinnerService
    
  ) { }

  isRegiter: boolean = false;
  isChangePassword = false;
  dialogUtils = new DialogUtils(this.dialog);

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.formChange = this.fb.group({
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });

    this.checkFormType();
  }

  checkFormType(){
    
    let url = window.location.href;

    if(url.includes("change-password"))
      this.validTokenForChangePassword();
    else
      this.isRegiter = true;
  }

  get f() {
    return this.form.controls
  }

  get fc(){
    return this.formChange.controls
  }

  isFieldInvalid(field: string){
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (!this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  @applyLoader()
  register(){
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
      this.dialogUtils.warningDialog(error.msg)
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

  validTokenForChangePassword(){
    this.activeRoute.queryParams.subscribe(param => {
      this.token = param.token;
    });
    
    this.authService.validTokenToChangePassword(this.token).subscribe(response => {
        this.isChangePassword = true;
        this.user = response;
    }, error => {
        this.dialogUtils.errorDialog(error.error.msg)
    })
  }

  changePassword(){
    
    let pass = this.fc.password.value
    let con = this.fc.confirm.value

    if(pass == "" || pass.length < 6){
      return 'Password too short!';
    }

    if(pass != con){
      this.dialogUtils.errorDialog("Password dont match  confirmation!");
      return false;
    }

    this.user.password = pass;

    this.authService.changePassword(this.user).subscribe(response => {
      this.dialogUtils.successDialog("Password has been changed successfully!")
      this.router.navigate(['/login'])
    } , error => {
        this.dialogUtils.errorDialog(error.error.msg);
    })

  }

  return(){
    this.router.navigate(['/index'])
  }

}
