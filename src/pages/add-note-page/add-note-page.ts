import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

// Services
import { NestService } from '../../services/NestService';

// Storage
import { Storage } from '@ionic/storage';
/*
  Generated class for the AddNotePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-note-page',
  templateUrl: 'add-note-page.html',
  providers: [NestService]
})
export class AddNotePagePage {

  nest_id = 0
  comment = "";


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private nestServices: NestService, private storage: Storage, public alertController: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNotePagePage');
    console.log(this.navParams.get('nest_id'));
    this.nest_id = this.navParams.get('nest_id');
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

 submitComment() {

    this.storage.get('currentUser').then((val) => {
      if(val != undefined)
      {
        let user = val.objectId;
        this.nestServices.addComment(this.nest_id, user, this.comment).subscribe(
          data => {

              let alert = this.alertController.create({
                title: 'Note saved!',
                buttons: ['OK']
              });
              alert.present(prompt);
              this.viewCtrl.dismiss();
          },
          err => {
              console.log(err);
          },
          () => console.log('Games Search Complete')
        );
      }
    });
 }

}
