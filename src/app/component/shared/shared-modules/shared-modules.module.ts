import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityRaritiesComponent } from '../quantity-rarities/quantity-rarities/quantity-rarities.component';
import { AddToCollectionComponent } from '../add-to-collection/add-to-collection.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CkeditorComponent } from '../ckeditor/ckeditor.component';
import { FormsModule } from '@angular/forms';
import { ChangeArtComponent } from '../change-art/change-art.component';
import { PriceUpdateComponent } from '../price-update/price-update.component';
import { RouterlinkStoreIdComponent } from '../routerlink-store-id/routerlink-store-id.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    QuantityRaritiesComponent,
    AddToCollectionComponent, 
    CkeditorComponent,
    PriceUpdateComponent,
    RouterlinkStoreIdComponent

  ],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule ,
    RouterModule
 
  ],
  exports: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent,
    PriceUpdateComponent,
    RouterlinkStoreIdComponent
  ],
  entryComponents: [
    QuantityRaritiesComponent, 
    AddToCollectionComponent, 
    CkeditorComponent,
    ChangeArtComponent,
    PriceUpdateComponent,
    RouterlinkStoreIdComponent

  ]
})

export class SharedModulesModule {
    static injector: Injector

    public constructor(injector: Injector) {
      SharedModulesModule.injector = injector;
    }
 }
