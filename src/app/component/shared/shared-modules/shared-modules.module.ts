import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityRaritiesComponent } from '../quantity-rarities/quantity-rarities/quantity-rarities.component';
import { AddToCollectionComponent } from '../add-to-collection/add-to-collection.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    QuantityRaritiesComponent,
    AddToCollectionComponent, 
    CkeditorComponent 
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule 
  ],
  exports: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent
  ],
  entryComponents: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent
  ]
})

export class SharedModulesModule { }
