import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Push, LocalNotifications} from 'ionic-native';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { NestService } from '../services/NestService';
import { AuthService } from '../providers/auth-service';
import { LoginPage } from '../pages/login/login';



declare var Connection: any;

@Component({
  templateUrl: 'app.html',
  providers: [NestService, AuthService]
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, private nestServices: NestService, storage: Storage) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
      Splashscreen.hide();


      // Get the settings
      this.nestServices.getSettings().subscribe(
          data => {
              console.log(data);
              storage.set('settings', data);
          },
          err => {
              console.log(err);
          },
          () => console.log('Installation ID Complete')
      );







      // Get to show for IOS only
      if (platform.is('mobile')) {
        let push = Push.init({
              android: {
                  senderID: "962497846052"
              },
              ios: {
                  alert: "true",
                  badge: true,
                  sound: true
              },
              windows: {}
          });

          push.on('registration', (data) => {

              // Send the device id

              this.nestServices.sendPushInstallation(data.registrationId).subscribe(
                  data => {

                      console.log(data.results);
                  },
                  err => {
                      console.log(err);
                  },
                  () => console.log('Installation ID Complete')
              );

              console.log(data.registrationId);
          });

          push.on('notification', (data) => {
              console.log(data.message);
              console.log(data.title);
              console.log(data.count);
              console.log(data.sound);
              console.log(data.image);
              console.log(data.additionalData);
          });

          push.on('error', (e) => {
              console.log(e.message);
          });

          LocalNotifications.clearAll();


          // Check for network connection


        }// end of IOS check

    });
  }
}
