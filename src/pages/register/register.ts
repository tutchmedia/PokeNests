import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
