import { Component, Input, OnInit } from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-routerlink-store-id',
  templateUrl: './routerlink-store-id.component.html',
  styleUrls: ['./routerlink-store-id.component.css']
})
export class RouterlinkStoreIdComponent implements OnInit {

  constructor() { }

  @Input() path:string
  @Input() complement:string
  @Input() id:string
  @Input() key:string
  @Input() text:string

  ngOnInit() {
  }

  storedCardId() {
    localStorage.setItem(this.key, this.id);
  }

}
