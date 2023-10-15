import { Component, Input, OnInit } from '@angular/core';
import { PriceUpdateServices } from './price-update.services';
import { ToastrService } from 'ngx-toastr';
import { applyLoader } from '../decorators/Decorators';
import { SpinnerService } from 'src/app/service/spinner.service';
import { AuthService } from 'src/app/service/auth-service/auth.service';
import { User } from 'src/app/classes/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-price-update',
  templateUrl: './price-update.component.html',
  styleUrls: ['./price-update.component.css']
})
export class PriceUpdateComponent implements OnInit {
  @Input() name:string;
  @Input() typeSearch:string;
  constructor(public service: PriceUpdateServices,  private toastr: ToastrService, public spinner: SpinnerService, public user: AuthService ) { }


  isAdmin: boolean = false;

  ngOnInit() {
    this.user.getCurrentUser$().subscribe(data => {
      if(data['sub'] === environment.userAdmin)
        this.isAdmin = true;
    })
  }

  getPrice(){
     if(this.name == undefined || this.name == null){
       this.toastr.error("Invalid Set Name!")
       return false;
     }
     if(this.typeSearch == "SET")
        this.getSetPrice()
  }

  @applyLoader()
  getSetPrice() {
    this.spinner.show()
    this.service.updateSetPrice(this.name).subscribe(resp => {
        console.log(resp);
        this.toastr.success("Sent to the queue successfully!")
        this.spinner.hide()
    }, error => {
        this.toastr.error(error);
        this.spinner.hide()
    })
  }
}
