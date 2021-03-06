import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';

// other pages
import { AddNotePagePage } from '../add-note-page/add-note-page';


// Services
import { NestService } from '../../services/NestService';
// Storage
import { Storage } from '@ionic/storage';

declare var google: any;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [NestService]
})
export class ContactPage {

  item = 0;
  nest = [{}];
  notes = [{}];
  notesuser = [{}];
  pokemon = [{}];
  checkedIn = 0;
  checkInText = "";
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentMapCenter = null;

  // Default view
  innerTab = "";
  showInfo = true;
  showMap = false;
  showNotes = false;
  doneLoad = false;
  noteCount = 0;

  constructor(public params: NavParams, private nestServices: NestService, private alertController: AlertController, private storage: Storage, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {

    this.item = this.params.get('nest_id');

    this.changePage('showInfo');

  }

  ngAfterViewInit() {
      console.log('on after view init', this.mapElement);
      // this returns null
  }


  changePage(view) {

    if(view == "showMap")
    {
      // Reload the map div
      this.loadTheMap(this.nest);
      //google.maps.event.trigger(this.map, 'resize');
      //console.log(this.mapEleent.nativeElement.style.height)
      //this.mapElement.nativeElement.style.height = (this.mapElement.nativeElement.style.height + 1);
      // Show page
      this.showMap = true;
      this.showInfo = false;
      this.showNotes = false;
    }

    if(view == "showNotes")
    {
      this.item = this.params.get('nest_id');
      this.getNotes(this.item);
      // Show page
      this.showNotes = true;
      this.showInfo = false;
      this.showMap = false;
    }

    if(view == "showInfo")
    {
      this.item = this.params.get('nest_id');
      this.getNests(this.item);
      // Show page
      this.showInfo = true;
      this.showMap = false;
      this.showNotes = false;
    }

  }

  loadMap(lat, lng){
    let latLng = new google.maps.LatLng(lat, lng);

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //google.maps.event.trigger(this.mapElement.nativeElement, 'resize');

    //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    let mapEle = this.mapElement.nativeElement;

    this.map = new google.maps.Map(mapEle, mapOptions);
    google.maps.event.trigger(this.map, 'resize');
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });

  }

  ionViewDidEnter() {
    this.getCheckedIn();
  }



  doCheckIn(checkIn) {
    this.storage.get('currentUser').then((val) => {
        if(val == null) {
          console.log("No user set - Needs to login ");
          let alert = this.alertController.create({
            title: 'Not logged in!',
            subTitle: 'In order to check in to a location, you must be logged in.',
            buttons: ['OK']
          });
          alert.present(prompt);
        } else {
          console.log("User set and able to check in");
          let user_id = val.objectId;
          let location_id = this.params.get('nest_id');
            this.nestServices.checkInLocation(user_id, location_id).subscribe(
              data => {

                  this.storage.set('lastCheckIn', checkIn);

                  let alert = this.alertController.create({
                    title: 'Checked In!',
                    subTitle: 'For the next 30 minutes, you will be shown as active in this area.',
                    buttons: [{
                        text: 'Ok',
                        handler: data => {
                          this.getCheckedIn();
                        }
                      }]
                  });
                  alert.present(prompt);
              },
              err => {
                  console.log(err);
              },
              () => console.log('Games Search Complete')
          );
        }
     });
  }

  checkIn() {

    // Check to see if there is already a check-in

    this.storage.get('lastCheckIn').then((val) => {

      // Setup the current time
      var dateToday = new Date();
      dateToday.setMinutes(dateToday.getMinutes());
      let check_date = dateToday.toISOString();
      let current_date = dateToday.getTime();

      // Get the current selected nest id
      let location_id = this.params.get('nest_id');
      // Create the array with the data above
      let checkIn = [{"location":location_id, "time":check_date}];

      // Check if data has history
      if(val == null) {
          this.doCheckIn(checkIn);
      } else {
        // Convert the saved DB time
        var dbdate = new Date(val[0].time);
        dbdate.setMinutes(dateToday.getMinutes() + 30);
        var saved_date = dbdate.getTime();

        if(current_date < saved_date) {
          let alert = this.alertController.create({
            title: 'Unable to check in',
            subTitle: 'It appears you are already checked in here.',
            buttons: ['OK']
          });
          alert.present(prompt);
        } else {
          this.doCheckIn(checkIn);
        }
      }


      // Check if time is less than 30 minutes over the saved time


    });






  }

  getCheckedIn() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    //loading.present();
    this.doneLoad = false;


    let location_id = this.params.get('nest_id');
      // Do a check againt the value for the time and check it wasn't in the last hour
    this.nestServices.getCheckedIn(location_id).subscribe(
        data => {
          if(this.doneLoad == false) {
            this.checkedIn = data.results.length;
            if(this.checkedIn == 1) {
              this.checkInText = this.checkedIn+" person has been here.";
            } else {
              this.checkInText = this.checkedIn+" people have been here.";
            }
          }
          this.doneLoad = true;
          console.log(data);
        },
        err => {
            console.log(err);
        },
        () => loading.dismiss()
    );



  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }


  loadTheMap(data) {
    if(data.location.latitude == undefined || data.location.longitude == undefined) {
      let alert = this.alertController.create({
        title: 'No map data.',
        subTitle: 'Sorry, we could not find any map data.',
        buttons: ['OK']
      });
      alert.present(prompt);
    } else {
      //this.loadMap();

      let latLng = new google.maps.LatLng(data.location.latitude, data.location.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      let mapEle = this.mapElement.nativeElement;

      this.map = new google.maps.Map(mapEle, mapOptions);
      //google.maps.event.trigger(this.map, 'resize');


      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
      this.currentMapCenter = this.map.getCenter();

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(this.currentMapCenter);
      });

      let content = "<small>"+ data.location_name +"</small>";

      this.addInfoWindow(marker, content);
    }
  }

  getNests(nest_id) {
    this.nestServices.listNestDetails(nest_id).subscribe(
        data => {
            this.nest = data;
            this.pokemon = data.pokemon;

        },
        err => {
            console.log(err);
        },
        () => console.log('Games Search Complete')
    );
  }

  getNotes(nest_id) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.nestServices.listNestNotes(nest_id).subscribe(
        list => {
            this.notes = list.results;
            this.noteCount = list.results.length;
        },
        err => {
            console.log(err);
        },
        () => loading.dismiss()
    );
  }

  addComment() {
    console.log("called note model");

    // Check if logged in
    this.storage.get('currentUser').then((val) => {

      if(val == undefined)
      {
        let alert = this.alertController.create({
          title: 'Not logged in!',
          subTitle: 'In order to add a note, you must be logged in.',
          buttons: ['OK']
        });
        alert.present(prompt);
      } else {
        let commentModal = this.modalCtrl.create(AddNotePagePage, { nest_id: this.item });
        commentModal.present();
      }


    });



  }


}
