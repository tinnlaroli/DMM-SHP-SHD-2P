import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptRejectPageRoutingModule } from './accept-reject-routing.module';

import { AcceptRejectPage } from './accept-reject.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptRejectPageRoutingModule
  ],
  declarations: [AcceptRejectPage]
})
export class AcceptRejectPageModule {}
