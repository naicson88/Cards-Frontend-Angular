import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityRaritiesComponent } from '../quantity-rarities/quantity-rarities/quantity-rarities.component';

@NgModule({
  declarations: [QuantityRaritiesComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    QuantityRaritiesComponent
  ],
  entryComponents: [QuantityRaritiesComponent]
})

export class SharedModulesModule { }
