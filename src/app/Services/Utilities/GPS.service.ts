
import { Injectable } from '@angular/core';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ApiService } from '../Api/Api.service';
import { StorageWebService } from '../Storage/StorageWeb.service';
import { BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastService } from './Toast.service';
import { ToastController } from '@ionic/angular';



@Injectable({
    providedIn: 'root'
})

export class GPSService {


    change = new BehaviorSubject(false);
    $listenStatus = this.change.asObservable();

    constructor(
      private locationAccuracy: LocationAccuracy,
      private geolocation: Geolocation,    
      private androidPermissions: AndroidPermissions,
      private api: ApiService,
      private storage: StorageWebService,
      private toas: ToastController
    ) {
 
    }
  

    changeStatus(status) {
        this.change.next(status)
    }

    checkPermission(data) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then( async (result) => {
            if (result.hasPermission) {
              this.enableGPS(data);
            } else {
              this.locationAccPermission(data);
            }
          },
          async (error) => {

            const login = await this.storage.getLogin();

            if (login) {

            this.api.eventRegister(login[0].AccessToken, {
                event: 15,
                lat: 0,
                lng: 0,
                entity: '1',
                entityID:'1'
            }).subscribe(async (rs) => {

        

            const msgg = await this.toas.create({
                message: 'No aceptó los permisos de usar el GPS',
                duration: 5000
              })
    
              await msgg.present();

            }, (err) => {
              //  this.changeStatus(false);
            })

        }

          }
        );
      }
    
      locationAccPermission(data) {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if (canRequest) {
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
              .then(
                () => {
                  this.enableGPS(data);
                },
                async (error) => {
                    const login = await this.storage.getLogin();

                    if (login) {
        
                    this.api.eventRegister(login[0].AccessToken, {
                        event: 15,
                        lat: 0,
                        lng: 0,
                        entity: '1',
                        entityID:'1'
                    }).subscribe(async (rs) => {
        
                
        
                    const msgg = await this.toas.create({
                        message: 'No aceptó los permisos de usar el GPS, por favor acéptelos',
                        duration: 5000
                      })
            
                      await msgg.present();
        
                    }, (err) => {
                      //  this.changeStatus(false);
                    })
                }

            }
              );
          }
        });
      }
    
      enableGPS(data) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.currentLocPosition(data)
          },
           async (error) => {

            const login = await this.storage.getLogin();

                    if (login) {
        
                    this.api.eventRegister(login[0].AccessToken, {
                        event: 15,
                        lat: 0,
                        lng: 0,
                        entity: '1',
                        entityID:'1'
                    }).subscribe(async (rs) => {
        
                
        
                    const msgg = await this.toas.create({
                        message: 'No aceptó los permisos de usar el GPS, por favor acéptelos',
                        duration: 5000
                      })
            
                      await msgg.present();
        
                    }, (err) => {
                      //  this.changeStatus(false);
                    })
                }

          }
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
    
      currentLocPosition(data) {
        this.geolocation.getCurrentPosition().then(async (response) => {

        //   this.locationCordinates.latitude = response.coords.latitude;
        //   this.locationCordinates.longitude = response.coords.longitude;
        //   this.locationCordinates.accuracy = response.coords.accuracy;
        //   this.locationCordinates.timestamp = response.timestamp;
         const login = await this.storage.getLogin();

         if (login) {

            this.api.eventRegister(login[0].AccessToken, {
                event: data.event,
                entity: '1',
                lat: response.coords.latitude,
                lng: response.coords.longitude,
                entityID: data.entityID
            }).subscribe((rs: any) => {

              if (rs.Status == 'OK') {
                this.changeStatus(true);
                this.disableGPS();

                console.log(rs)
              } else {
                this.currentLocPosition(data);
              }


               

            }, (err) => {
                this.changeStatus(false);
            })

         }

        }).catch((error) => {
            this.changeStatus(false);
          alert('Error: ' + error);
        });
      }
    
    }