import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-associate',
  templateUrl: './admin-associate.component.html',
  styleUrls: ['./admin-associate.component.css']
})
export class AdminAssociateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  formNewAssociation: FormGroup

}
