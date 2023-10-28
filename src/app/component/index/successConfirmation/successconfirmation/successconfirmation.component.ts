import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { SpinnerService } from 'src/app/service/spinner.service';
import { SuccessconfirmationService } from './successconfirmation.service';
import { applyLoader } from 'src/app/component/shared/decorators/Decorators';

@Component({
  selector: 'app-successconfirmation',
  templateUrl: './successconfirmation.component.html',
  styleUrls: ['./successconfirmation.component.css']
})
export class SuccessconfirmationComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private spinner: SpinnerService, private service: SuccessconfirmationService,  private dialog: MatDialog,
    private router: Router) { }

  token:string = "";
  reset:string = "";
  success:boolean = false;

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(param => {
      this.token = param.token;
      this.reset = param.reset;
    });

    if(this.token != undefined && this.token != "")
      this.validToken();
    else
      this.resetPassword();
  }

  @applyLoader()
  validToken(){
    
    if(this.token == undefined || this.token == "")
      this.router.navigate(['/index'])

    this.service.validTokenEmailConfirmation(this.token).subscribe(response => {
      this.success = true;
    }, error => {
      console.log(error)
      if(error.error.msg == "It was not possible find User with this token")
        this.router.navigate(['/index'])
      else if(error.error.msg.includes("Error: The max date for validation is expired!")){
       if(confirm(error.error.msg) == true){
        this.router.navigate(['/index'])
       }else {
        this.router.navigate(['/index'])
       };
      }
    })
  }

    resetPassword(){
      
  }
  
  login(){
    this.router.navigate(['/login'])
  }
}
