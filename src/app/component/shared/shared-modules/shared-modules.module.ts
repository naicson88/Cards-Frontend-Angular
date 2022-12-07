import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityRaritiesComponent } from '../quantity-rarities/quantity-rarities/quantity-rarities.component';
import { AddToCollectionComponent } from '../add-to-collection/add-to-collection.component';

@NgModule({
  declarations: [QuantityRaritiesComponent, AddToCollectionComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    QuantityRaritiesComponent, AddToCollectionComponent
  ],
  entryComponents: [QuantityRaritiesComponent, AddToCollectionComponent]
})

export class SharedModulesModule { }
