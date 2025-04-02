import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage'; // Añade esta importación
import { RouterModule } from '@angular/router';
import { LoginPageModule } from './login/login.module';
import { TabsPageModule } from './tabs/tabs.module';
import { PostsPageModule } from './posts/posts.module';
import { AcceptRejectPageModule } from './accept-reject/accept-reject.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    FormsModule,
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage] // Configuración explícita
    }),
    LoginPageModule,
    TabsPageModule,
    PostsPageModule,
    AcceptRejectPageModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}1