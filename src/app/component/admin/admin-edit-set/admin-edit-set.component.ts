import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-edit-set',
  templateUrl: './admin-edit-set.component.html',
  styleUrls: ['./admin-edit-set.component.css']
})
export class AdminEditSetComponent implements OnInit {

  constructor(private admin: AdminDashboardComponent,  private ckEditor: CkeditorComponent) { }

  @ViewChild("myEditor", { static: false }) myEditor: any; 
  
  ngOnInit() {
  }

  formSearchToEdit: FormGroup = new FormGroup({})
  formEditSet: FormGroup = new FormGroup({})

  arrSetSource:[] = [];

  foundSetToEdit: boolean = true

  searchSets(setType:string){
    this.admin.searchSets(setType).subscribe(data => {
      this.arrSetSource = data
    });
  }

}
