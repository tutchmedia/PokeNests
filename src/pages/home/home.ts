import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  items = [{
    "title":"Bulbasaur",
    "image":"001 - ymJUN7U.png",
    "location":"Highfields"
  },{
    "title":"Pikachu",
    "image":"025 - BnOQ18z.png",
    "location":"Woodthorpe Park"
  }];

}
