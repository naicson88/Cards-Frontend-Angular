import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute,  Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service/auth.service';

@Component({
  selector: 'app-error-pages',
  templateUrl: './error-pages.component.html',
  styleUrls: ['./error-pages.component.css']
})
export class ErrorPagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('img',{static: false})img:HTMLElement;

  constructor(private router: ActivatedRoute, private authService: AuthService, private r: Router) { }

  ngAfterViewChecked(): void {
   
  }

  errorImage:string;
  isLoggedIn:boolean;

  ngOnInit() {
    debugger
    this.verifyUser()
    this.loadErrorImage()
  }

  scroll(){
   window.scrollTo(0,250)
  }

  loadErrorImage(){
    
      let event = this.router.snapshot.paramMap.get('code');
   
        if(event === '500'){
          this.errorImage = '..//..//..//assets//img//error//500.jpg';
          return;
        } 
        else if(event === '404'){
          this.errorImage = '..//..//..//assets//img//error//404.PNG'
          return;

        } else {
          this.errorImage = '..//..//..//assets//img//error//500.jpg';
          return;
        }

  }

  verifyUser(){       
    this.authService.isLoggedIn$().subscribe(result => {
     this.isLoggedIn = result;
      if(!this.isLoggedIn)
        this.r.navigate(["/index"])
    })
  }

}
