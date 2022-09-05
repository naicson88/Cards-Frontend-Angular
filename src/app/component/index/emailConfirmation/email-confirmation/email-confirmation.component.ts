import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}

  confirmationEmail:string = "";

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(param => {
      console.log(param.email)
      this.confirmationEmail = param.email
    })
  }

  return(){
    this.router.navigate(['/index'])
  }

}
