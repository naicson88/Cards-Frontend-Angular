import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralSearchDTO } from 'src/app/classes/GeneralSearchDTO';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { GeneralFunctions } from 'src/app/Util/Utils';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        marginLeft: "260px"
      })),
      state('closed', style({
        marginLeft: "20px"
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),  
    ]),

    trigger('hideShowMenu', [
      // ...
      state('open', style({
        marginLeft: "0"
      })),
      state('closed', style({
        marginLeft: "-260px"
      })),
      transition('open <=> closed', [
        animate('0.3s')
      ]),  
    ]),


    trigger('hideShowMenuOptions', [
      // ...
      state('open', style({
       display: 'block'
      })),
      state('closed', style({
        display: 'none'
      })),

    ]),

  ],

})


export class SideMenuComponent implements OnInit {

  isShowDeck: boolean = false;
  isShowCard: boolean = false;
  isIconeExpand: boolean = false;
  isIndex: boolean = false;
  isLogin: boolean = false;
  isRegister: boolean = false;
  isConfirmation: boolean = false;
  isAdminOrModerator: boolean = false;
  isConfirmed: boolean = false;
  isMaintenence: boolean = false

  generalSearchArr:GeneralSearchDTO[] = []
  dataCtrl = new FormControl('');
  filteredData: Observable<any[]>;

  constructor(private router: Router, private authService: AuthService, private route: Router  ) {
    this.filteredData = this.dataCtrl.valueChanges.pipe(
      startWith('Dark'),
      map(data => (data.length > 2 ? this._filterStates(data) : [])),
    );   
   }  

   private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    let arr : GeneralSearchDTO[] = [];
    arr = this.generalSearchArr.filter(data => (data.name.toLowerCase().includes(filterValue)) 
                                        || (data.setCode != null ? data.setCode.toLowerCase().includes(filterValue) : null));
    return arr
  }
  
  ngOnInit() { 
    this.checkRouter();
    this.validUser();
   
  }

  checkRouter(){
    this.router.events.subscribe((event:any) => {
      
      if(event instanceof NavigationEnd) {

        if(event.url === '/index'){
          this.isIndex = true;
        } 
        else if(event.url.includes('/login')){
          this.isLogin = true;
        }
        else if(event.url.includes('/register')){
          this.isRegister = true
        } 
        else if(event.url.includes('/confirm-email')){
          this.isConfirmation = true;
        }
        else if (event.url.includes('/confirmation')){
          this.isConfirmed = true;
        }
        else if(event.url.includes('/maintenence')){
          this.isMaintenence = true;
        }
        
        else if(event.url === '/'){
          this.isIndex = true

        } else {
          this.isIndex = false;
          this.isLogin = false;
          this.isRegister = false;
        }
        
      }
    }) 
  }

  mostrarUlDecks(){

    if(this.isShowDeck == false){
     this.isShowDeck = true;
    } else {
      this.isShowDeck = false;
    }
  }

  mostrarUlCards(){
    if(this.isShowCard == false){
      this.isShowCard = true;
     } else {
       this.isShowCard = false;
     }
  }

  marginIconeLateral(trans: string){

    if(this.isIconeExpand == false){
      this.isIconeExpand = true;
     } else {
       this.isIconeExpand = false;
     }
  }

  logout() {
    this.authService.logout();
   // this.router.navigate(['/index'])
  }

  validUser(){
    GeneralFunctions.validUser(this.authService, this.router).subscribe(result => {
        this.isAdminOrModerator = result
    })
  }

  storeDeckId(id:any){
      GeneralFunctions.saveDeckInfoLocalStorage(0, "USER", "DECK");
  }

    generalSearch(e:any){
      let param = e.target.value
      if(param.length === 3){
        this.authService.generalSerach(param).subscribe(data => {
          this.generalSearchArr = data;
          // console.log(this.generalSearchArr)
        })
      } 
    }

    cardImagem(cardId: any){
         
         let urlimg = GeneralFunctions.cardImagem + cardId + '.jpg';
         return urlimg;
     }

     redirectToPage(data:GeneralSearchDTO){
 
      this.storeInformations(data.id, data.entityType, data.name)
     }

     storeInformations(id:any, setType:string, name:string){
      
      let arg = setType != 'CARD' ? 'idDeckDetails' : 'idCard'
      GeneralFunctions.saveDeckInfoLocalStorage(id, "konami", setType);

      if(setType == 'DECK')
       this.route.navigate(['/deck-details/', name]);
      else if(setType == 'CARD')
       this.route.navigate(['/card-detail/', name]);
      else if(setType == 'COLLECTION')
       this.route.navigate(['/collection-details/', name]);
      else
        console.log('ERROR: It was not possible redirect in General Search')
    }

    goToAccountManage() {
      this.router.navigate(['account-manager'])
    }

}