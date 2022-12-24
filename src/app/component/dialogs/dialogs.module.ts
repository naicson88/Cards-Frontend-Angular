import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/Util/materialModule/material/material.module';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { InfoDialogComponent } from './info-dialog/info-dialog/info-dialog.component';


@NgModule({
  declarations: [ErrorDialogComponent, WarningDialogComponent, SuccessDialogComponent, InfoDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule
  ],
  exports:[
    
  ],
  providers: [
  /*{ provide: MAT_DIALOG_DATA, useValue: {} },
   { provide: MatDialogRef, useValue: {} }*/
  ],
  entryComponents:[ErrorDialogComponent, WarningDialogComponent, SuccessDialogComponent, InfoDialogComponent] 
})

export class DialogModule { }