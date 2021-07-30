import { CanActivate, Router } from '@angular/router';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable()
export class LoginGuard implements CanActivate {

     constructor(
          private storage: StorageWebService,
          private router: NavController
     ) { }

     canActivate() {
          return this.storage.getLogin().then((data) => {
               console.log('ENYTRANDO AL GUARD', data)
             if (data.length > 0) {
                  this.router.navigateRoot(['/tabs']);
                  return false;
             } else {
                  return true;
             }
          }).catch(() => {
               this.router.navigateRoot(['/login']);
               console.log('Error en auth/serve-store');
               return true;
          });
     }

}


