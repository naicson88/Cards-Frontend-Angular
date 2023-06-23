import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityRaritiesComponent } from '../quantity-rarities/quantity-rarities/quantity-rarities.component';
import { AddToCollectionComponent } from '../add-to-collection/add-to-collection.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { FormsModule } from '@angular/forms';
import { ChangeArtComponent } from '../change-art/change-art.component';
import { PriceUpdateComponent } from '../price-update/price-update.component';


@NgModule({
  declarations: [
    QuantityRaritiesComponent,
    AddToCollectionComponent, 
    CkeditorComponent,
    PriceUpdateComponent

  ],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule ,
 
  ],
  exports: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent,
    PriceUpdateComponent,
  ],
  entryComponents: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent,
    ChangeArtComponent,
    PriceUpdateComponent

  ]
})

export class SharedModulesModule {
    static injector: Injector

    public constructor(injector: Injector) {
      SharedModulesModule.injector = injector;
    }
 }
