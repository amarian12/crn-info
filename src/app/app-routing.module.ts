import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelaynodesComponent } from './relaynodes/relaynodes/relaynodes.component';


const routes: Routes = [
  {
    path: '',
    component: RelaynodesComponent,
  },
  // {
  //   path: 'crns',
  //   component: CrnsComponent,
  // },
  // {
  //   path: 'relaynode',
  //   component: RelaynodesComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
