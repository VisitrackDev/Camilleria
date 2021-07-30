import { Component, OnInit } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { ApiService } from '../Services/Api/Api.service';



@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  locationCordinates: any;
  timestamp: any;

  enabled = false;

  constructor(
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,    
    private androidPermissions: AndroidPermissions,
    private storage: StorageWebService,
    private api: ApiService
  ) {
    this.locationCordinates = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timestamp = Date.now();
  }

  ngOnInit() {

  }

  async checkPermission() {
    const login = await this.storage.getLogin();

    if (login) {

       this.api.eventRegister(login[0].AccessToken, {
        event: 21,
        entityID: '1085728',
        lat: 0,
        lng: 0
       }).subscribe((rs) => {

           console.log(rs)

       }, (err) => {

       })

    }
  }

  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              alert(error)
            }
          );
      }
    });
  }

  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.currentLocPosition()
      },
      error => alert(JSON.stringify(error))
    );
  }


  disableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_LOW_POWER).then(
      () => {
      //  this.currentLocPosition()
      },
      error => alert(JSON.stringify(error))
    );
  }

  currentLocPosition() {
    this.geolocation.getCurrentPosition().then((response) => {
      this.locationCordinates.latitude = response.coords.latitude;
      this.locationCordinates.longitude = response.coords.longitude;
      this.locationCordinates.accuracy = response.coords.accuracy;
      this.locationCordinates.timestamp = response.timestamp;
    }).catch((error) => {
      alert('Error: ' + error);
    });
  }

}