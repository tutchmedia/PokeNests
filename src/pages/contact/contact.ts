import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
// Services
import { NestService } from '../../services/NestService';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [NestService]
})
export class ContactPage {

  item = 0;
  nest = [{}];
  pokemon = [{}];

  constructor(public params: NavParams, private nestServices: NestService) {
    this.item = this.params.get('nest_id');

    this.getNests(this.item);
  }

  getNests(nest_id) {
    this.nestServices.listNestDetails(nest_id).subscribe(
        data => {
            this.nest = data;
            this.pokemon = data.pokemon;
            console.log(this.pokemon);
        },
        err => {
            console.log(err);
        },
        () => console.log('Games Search Complete')
    );
  }

}
