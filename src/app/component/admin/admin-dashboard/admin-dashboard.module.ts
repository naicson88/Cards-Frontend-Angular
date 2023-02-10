import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/Util/materialModule/material/material.module';
import { CkeditorComponent } from '../../shared/ckeditor/ckeditor.component';


@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    MaterialModule,

  ],
  exports:[

  ],

  providers: [
    CkeditorComponent
  ]
})

export class AdminDashboardModule { }