import { UsercardsModule } from './component/usercards/usercards.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DeckComponent } from './component/deck/deck.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import {NgxPaginationModule} from 'ngx-pagination';
import { HomeComponent } from './component/home/home.component'; // <-- import the module
import { FilterPipeModule } from 'ngx-filter-pipe';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { DeckDetailComponent } from './component/deck-detail/deck-detail.component';
import { CardDetailComponent } from './component/card-detail/card-detail/card-detail.component';
import { IndexComponent } from './component/index/index.component';
import { LoginComponent } from './component/index/login/login.component';

import { RegisterComponent } from './component/index/register/register.component';
import { FooterComponent } from './component/footer/footer.component';
import { authStrategyProvider } from './service/auth-service/auth.strategy';
import { AuthInterceptor } from './service/auth-service/AuthInterceptor';
import { ArchetypeComponent } from './component/archetype/archetype.component';
import { ArchetypeDetailsComponent } from './component/archetype-details/archetype-details/archetype-details.component';
import {  MatDialogRef, MatSpinner, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerComponent } from './component/spinner/spinner.component';
import { SpinnerService } from './service/spinner.service';
import { CardsSearchComponent } from './component/cards-search/cards-search/cards-search.component';
import { Imagens } from './classes/Imagens';
import { MaterialModule } from './Util/materialModule/material/material.module';
import { UsercardsComponent } from './component/usercards/usercards.component';
import { SideCardsearchComponent } from './component/cards-search/side-cardsearch/side-cardsearch.component';
import { DeckDetailUserModule } from './component/deck-detail-user/deckDetailUser.module';
import { DialogModule } from './component/dialogs/dialogs.module';
import { CardinfoComponent } from './component/tooltip/cardinfo/cardinfo.component';
import { DeckDetailUserComponent } from './component/deck-detail-user/deck-detail-user.component';
import { SearchBoxComponent } from './component/cards-search/search-box/search-box.component';
import { ErrorPagesComponent } from './error-pages/error-pages/error-pages.component';
import { BaseRoleGuard } from './Util/CanActivate/BaseRoleGuard';
import { AdminDashboardModule } from './component/admin/admin-dashboard/admin-dashboard.module';
import { UserSetcollectionComponent } from './component/user-setcollection/user-setcollection.component';
import { TransferComponent } from './component/transfer/transfer.component';
import { SideMenuComponent } from './component/side-menu/side-menu.component';
import { EmailConfirmationComponent } from './component/index/emailConfirmation/email-confirmation/email-confirmation.component';
import { SuccessconfirmationComponent } from './component/index/successConfirmation/successconfirmation/successconfirmation.component';
import { BackToTopComponent } from './Util/BackToTopButton/back-to-top/back-to-top.component';
import { MaintenenceComponent } from './error-pages/maintenence-page/maintenence/maintenence.component';
import { SharedModulesModule } from './component/shared/shared-modules/shared-modules.module';
import { AdminModule } from './component/admin/admin-module';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    DeckComponent,
    SideMenuComponent,
    HomeComponent,
    DeckDetailComponent,
    CardDetailComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ArchetypeComponent,
    ArchetypeDetailsComponent,
    SpinnerComponent,
    MatSpinner,
    CardsSearchComponent,
    UsercardsComponent,
    DeckDetailComponent,
    SideCardsearchComponent,
    CardinfoComponent,
    DeckDetailUserComponent,
    SearchBoxComponent,
    ErrorPagesComponent,
    UserSetcollectionComponent,
    TransferComponent,
    EmailConfirmationComponent,
    SuccessconfirmationComponent,
    BackToTopComponent,
    MaintenenceComponent,
    AdminDashboardComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule ,
    IvyCarouselModule,
    FilterPipeModule,
    FormsModule,
    ReactiveFormsModule ,
    NgxSpinnerModule,
    MaterialModule,
    UsercardsModule,
    DeckDetailUserModule,
    DialogModule,
    AdminDashboardModule,
    SharedModulesModule,
    AdminModule, 
    ToastrModule.forRoot()

  ],
  
  providers: [
    BaseRoleGuard,
    authStrategyProvider, 

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    
    },

  {provide: HTTP_INTERCEPTORS,useClass: SpinnerService, multi: true },
  Imagens,
  { provide: MatDialogRef, useValue: {}}, { provide: MAT_DIALOG_DATA, useValue: {} },
  
],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
