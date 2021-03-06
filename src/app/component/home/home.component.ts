import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeIdentifier } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: any;
  user: any;

  constructor( private service: HomeService, private router :Router, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
   // this.getUser();
    this.loadHomeInfo();
  }

    infoHome: any[] = [];
    img:string

    loadHomeInfo(){
      this.service.loadHomeInfo().subscribe(info => {
       this.infoHome = info;
   
       this.img = this.infoHome['lastSets'].img

      }), error =>{
        let errorCode = error.status;
        this.router.navigate(["/error-page", errorCode]);
      }
    }

    // limparUrl(lastSets: any) {
    //     lastSets.forEach(set => {
    //       set['img'] = this.domSanitizer.bypassSecurityTrustUrl(set['img']);
    //       console.log(set['img'])
    //     });
    // }

    storeDeckId(id:any){
      //  const id = event.target.name;
        localStorage.setItem("idDeckDetails", id);
      
      }

}
