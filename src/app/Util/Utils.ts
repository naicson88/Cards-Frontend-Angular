
import { Router } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { AuthService } from "../service/auth-service/auth.service";
import { ExtraDeckTypes } from "./enums/ExtraDeckTypes";

export abstract class GeneralFunctions  {

    public static cardImagem:string = 'https://images.ygoprodeck.com/images/cards/'
    public static croppedImage:string = 'https://images.ygoprodeck.com/images/cards_cropped/'

    
    Notification: any // Necessario pra rodar function de Notification do browser

    public static isExtraDeckCard(cardType:string): boolean {  
      return (<any>Object).values(ExtraDeckTypes).includes(cardType)
    }

    public static formatCurrencyNumber(value:number){
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      })

      return formatter.format(value);
    }

    public static rarity(raridade:string):string {
        if(raridade == null || raridade == undefined)
          return null;
        if(raridade == 'Common')
            return "common"     
        if(raridade == 'Rare')
          return "rare";       
        if(raridade == 'Super Rare')
          return "super_rare";    
        if(raridade == 'Ultra Rare')
          return "ultra_rare";           
    }

    public static colorRarity(raridade:string):string {
      if(raridade == null || raridade == undefined)
        return null;
      if(raridade == 'Common')
          return "color-common"     
      else if(raridade == 'Rare')
        return "color-rare";       
      else if(raridade == 'Super Rare')
        return "color-super-rare";    
      else if(raridade == 'Ultra Rare')
        return "color-ultra-rare";
      else if(raridade == 'Secret Rare')
        return "color-secret-rare";
        
      else{
          return "color-common"
      }          
  }

 public static colorAttribute(att:string){
    if(att == null || att == undefined)
       return 'att-common';
       switch(att){
        case 'DARK': 
          return 'dark-color';
        case 'WIND': 
          return 'wind-color';
        case 'FIRE': 
          return 'fire-color';
        case 'EARTH': 
          return 'earth-color';
        case 'WATER': 
          return 'water-color';
        case 'LIGHT': 
          return 'light-color';
        case 'SPELL': 
          return 'magic-color';
        case 'TRAP': 
          return 'trap-color';

        default: 
          return 'att-common';     
       }        
  }

  public static validateEmail(email)  {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  public static storeInformation(arg1:string, id: any, source:string, setType: string){
    localStorage.setItem(arg1, id);
    localStorage.setItem("source", source);
    localStorage.setItem("set_type", setType);
  }

  public static storeDataLocalStorage(map: Map<string, any> ){
    map.forEach((value: string, key:any) => {
      sessionStorage.setItem(key, value);
    })
  }

  public static saveDeckInfoLocalStorage(id:any, source:string, setType:string) {
    let map = new Map<string, any>([
      ["idDeckDetails", id],
      ["source", source],
      ["set_type", setType],
    ]);
    console.log(map)
    this.storeDataLocalStorage(map);
  }

  public static validUser(authService: AuthService, router: Router): Observable<boolean> {
      const result = new Subject<boolean>();
      
      authService.getUser().subscribe(userReturned => { 

        const userRole:string = userReturned.role.roleName
          
          if(userRole == undefined || userRole == null)
            router.navigate(['/login'])
          if(userRole == "ROLE_ADMIN"  || userRole == "ROLE_MODERATOR")
            result.next(true);
          else if(userRole == "ROLE_USER")
            result.next(false);
          else
            result.next(false);

      }, error => {
        result.next(false)
        console.log("Error when try to consult user" + error.erro);
      })

      return result.asObservable();
    }
    
    checkIfIsAdmin(userRole:string) {   
      //  let user:string = localStorage.getItem('currentUser');
          
    }

    //Get String values o Enum
    public static enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
      return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
    }

    public static concateString(str1:string, str2:string){
      return str1.concat(str2);
    }

  //////////////////////// NÃO DELETAR //////////////////////////////////////
  //  notifyBrowser(){
  //     if(!window.Notification){
  //         console.log("Browser does not support notifications.");
  //         return false;
  //     }

  //     if(Notification.permission === 'granted'){
  //       new Notification('Hi there!', {
  //         body: 'How are you doing?',
  //         icon: 'https://img.icons8.com/?size=512&id=9918&format=png'
  //       });
  //     } else {
  //       Notification.requestPermission().then(p => {
  //         if(p === 'granted'){
  //           new Notification('Hi there!', {
  //             body: 'How are you doing?',
  //             icon: 'https://img.icons8.com/?size=512&id=9918&format=png'
  //           });
  //         } else {
  //           console.log("Browser does not support notifications.");
  //           return false;
  //         }
  //       }).catch(err => {
  //           console.error(err);
  //       })
  //     }

  //   }
  
}
