import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, Push} from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // Get to show for IOS only
      if (platform.is('ios')) {
        let push = Push.init({
              android: {
                  senderID: "12345679"
              },
              ios: {
                  alert: "true",
                  badge: true,
                  sound: 'false'
              },
              windows: {}
          });

          push.on('registration', (data) => {
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
        }// end of IOS check

    });
  }
}
