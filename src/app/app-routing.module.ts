import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './component/admin/admin-dashboard/admin-dashboard.component';
import { ArchetypeDetailsComponent } from './component/archetype-details/archetype-details/archetype-details.component';
import { ArchetypeComponent } from './component/archetype/archetype.component';
import { CardDetailComponent } from './component/card-detail/card-detail/card-detail.component';
import { CardsSearchComponent } from './component/cards-search/cards-search/cards-search.component';
import { SearchBoxComponent } from './component/cards-search/search-box/search-box.component';
import { DeckDetailUserComponent } from './component/deck-detail-user/deck-detail-user.component';
import { DeckDetailComponent } from './component/deck-detail/deck-detail.component';
import { DeckComponent } from './component/deck/deck.component';
import { HomeComponent } from './component/home/home.component';
import { EmailConfirmationComponent } from './component/index/emailConfirmation/email-confirmation/email-confirmation.component';
import { IndexComponent } from './component/index/index.component';
import { LoginComponent } from './component/index/login/login.component';
import { RegisterComponent } from './component/index/register/register.component';
import { SuccessconfirmationComponent } from './component/index/successConfirmation/successconfirmation/successconfirmation.component';
import { TransferComponent } from './component/transfer/transfer.component';
import { UserSetcollectionComponent } from './component/user-setcollection/user-setcollection.component';
import { UsercardsComponent } from './component/usercards/usercards.component';
import { ErrorPagesComponent } from './error-pages/error-pages/error-pages.component';
import { MaintenenceComponent } from './error-pages/maintenence-page/maintenence/maintenence.component';
import { BaseRoleGuard } from './Util/CanActivate/BaseRoleGuard';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AccountManagerComponent } from './component/account-manager/account-manager.component';

const routes: Routes = [
  { path: 'decks', component: DeckComponent , data : {set_type: 'DECK', source: 'KONAMI'}},
  { path: 'usercollection/decks', component: DeckComponent , data : {set_type: 'DECK', source: 'USER'}},
  { path: 'usercollection/cards', component: UsercardsComponent },
  { path: 'usercollection/transfer', component: TransferComponent},
  { path: 'home', component: HomeComponent },

  { path: 'deck-details/:deckName', component: DeckDetailComponent, data:{set_type: 'DECK'}},
  { path: 'collection-details/:deckName', component: DeckDetailComponent, data: {set_type: 'COLLECTION'}},
  { path: 'user-deck-details/:deckName', component: DeckDetailComponent, data: {source: 'USER'}},
  { path: 'user-setcollection-details/:deckName', component: DeckDetailComponent, data: {source: 'USER'}},
  { path: 'user-setcollection-cards/:setName', component: UserSetcollectionComponent},

  { path: 'card-detail/:cardName', component: CardDetailComponent },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent, data: {badCredential: false}},
  { path: 'register', component: RegisterComponent},
  { path: 'confirmation', component: SuccessconfirmationComponent},
    // children:[
    //   { path: 'confirm-email', component: EmailConfirmationComponent},
    // ]},
  { path: 'confirm-email', component: EmailConfirmationComponent},
  { path: 'archetypes', component: ArchetypeComponent},
  { path: 'archetypeDetails/:archId', component: ArchetypeDetailsComponent},
  { path: 'cards-search', component: CardsSearchComponent},
  { path: 'userdeck-details/:deckName', component: DeckDetailUserComponent },
  { path: 'search-box', component: SearchBoxComponent},
  { path: 'error-page/:code', component:ErrorPagesComponent},
  { path: 'maintenence', component:MaintenenceComponent},
  { path: 'admin-dashboard', component:AdminDashboardComponent, canActivate: [BaseRoleGuard]},
  { path: 'dashboard/:setName', component:DashboardComponent },
  { path: 'account-manager', component:AccountManagerComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'index', pathMatch: 'full' },
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }