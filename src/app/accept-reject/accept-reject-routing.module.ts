import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptRejectPage } from './accept-reject.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptRejectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptRejectPageRoutingModule {}
