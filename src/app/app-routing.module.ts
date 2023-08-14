import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErstellenComponent} from './erstellen/erstellen.component';
import {HochladenComponent} from './hochladen/hochladen.component';
import {ContractListComponent} from './contract-list/contract-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'liste', pathMatch: 'full'},
  {path: 'liste', component: ContractListComponent},
  {path: 'erstellen', component: ErstellenComponent},
  {path: 'bearbeiten/:id/:shortName', component: ErstellenComponent},
  {path: 'hochladen', component: HochladenComponent},
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
