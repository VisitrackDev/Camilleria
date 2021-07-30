import { CanActivate, Router } from '@angular/router';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable()
export class pageGuard implements CanActivate {

     constructor(
          private storage: StorageWebService,
          private router: NavController
     ) { }

     canActivate() {
          return this.storage.getLogin().then(async (data) => {
               console.log('ENYTRANDO AL  PAGE', data)
             if (data.length > 0) {
              
                  return true;
             } else {
               await this.storage.deleteActiveAll();
               await this.storage.deleteTimerData();
               await this.storage.deleteForm();
               await this.storage.deletePosition();
               this.router.navigateRoot(['/login']);
                  return false;
             }
          }).catch(() => {
               this.router.navigateRoot(['/login']);
               console.log('Error en auth/serve-store');
               return true;
          });
     }

}


