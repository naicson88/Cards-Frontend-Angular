import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from 'src/app/service/spinner.service';
import { AdminDashboardService } from '../admin-dashboard-service';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-associate',
  templateUrl: './admin-associate.component.html',
  styleUrls: ['./admin-associate.component.css']
})
export class AdminAssociateComponent implements OnInit {

  constructor(private admin: AdminDashboardComponent, private adminService: AdminDashboardService, private toastr: ToastrService,
    private spinner: SpinnerService) { }

  ngOnInit() {
  }

  @ViewChild('setSource', {static: false}) myDOMEle: ElementRef;

  arrSetSource: any[] = [];
  arrSetToAssociate: any[] = [];
  tableContent: any[] = [];

  formNewAssociation: FormGroup

  searchSets(setType:string){
    this.admin.searchSets(setType).subscribe(data => {
      this.arrSetSource = data
    });
  }

  searchSetsToAssociate(setType:string){
    this.admin.searchSets(setType).subscribe(data => {   
      this.arrSetToAssociate = data
    });
  }

  setToTable(index:any){
   
    if(!this.validateSource())
      return false;
      
   let  entity = this.arrSetToAssociate[index];

   let  toSet = {
      setId: entity.setId,
      name: entity.name
    }
      this.tableContent.push(toSet)
  }

  private validateSource() {
      let source = this.myDOMEle.nativeElement.value;
      if(source == undefined || source == null || source <= 0){
        alert('Please chose the Source first!')
        return false;
      }

      return true;
  }

  onNewAssociation(){

    if(!this.validateSource())
      return false;

      let obj = this.createNewAssociationObj();
      this.spinner.show()

      this.adminService.createNewAssociation(obj).subscribe(data => {
        this.toastr.success('Association Sent Successfully')
        this.spinner.hide()
      }, error => {
          this.spinner.hide()
          console.log(error)
      })
  }

  createNewAssociationObj() {
        debugger
      let source = this.myDOMEle.nativeElement.value;
      let arrayToAssociate = [];

      this.tableContent.forEach(content => {
          arrayToAssociate.push(content.setId)
      });

      let obj = {
          sourceId: Number(source),
          arrayToAssociate: arrayToAssociate
      }
      
      return obj;
  }

}
