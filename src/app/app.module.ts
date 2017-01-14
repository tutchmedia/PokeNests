import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CustomIconsModule } from 'ionic2-custom-icons';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';
import { RegisterPage } from '../pages/register/register';
import { LocationPage } from '../pages/location/location';
import { AddNotePagePage } from '../pages/add-note-page/add-note-page';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    LocationPage,
    AddNotePagePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CustomIconsModule // Add this!
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    RegisterPage,
    LocationPage,
    AddNotePagePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, Storage]
})
export class AppModule {}
