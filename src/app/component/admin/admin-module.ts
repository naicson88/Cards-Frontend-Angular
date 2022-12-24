import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminAssociateComponent } from './admin-associate/admin-associate.component';
import { AdminAddCardDeckComponent } from './admin-add-card-deck/admin-add-card-deck/admin-add-card-deck.component';
import { MaterialModule } from 'src/app/Util/materialModule/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { SharedModulesModule } from '../shared/shared-modules/shared-modules.module';

@NgModule({
    declarations: [
        AdminAssociateComponent, 
        AdminAddCardDeckComponent
    ],
    imports: [
        CommonModule, 
        MaterialModule, 
        ReactiveFormsModule,
        SharedModulesModule
    ],
    exports: [
        AdminAssociateComponent, 
        AdminAddCardDeckComponent,
    ],
    entryComponents: [
        AdminAssociateComponent, 
        AdminAddCardDeckComponent,
        FooterComponent
    ]
})

export class AdminModule { }