import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { retryWhen } from 'rxjs/operators';
import { LoginRequest } from 'src/app/classes/LoginRequest';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';



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
    private spinner: SpinnerService

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

    this.authService.login(loginRequest).subscribe(
      (user) => this.router.navigate([this.authService.INITIAL_PATH])
    );

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

}
