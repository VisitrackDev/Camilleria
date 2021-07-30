import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
     providedIn: 'root'
})

export class LoadingService {

     constructor(
          private loadingCtrl: LoadingController
     ) {

     }

     async createLoading(message) {
          const loading = await this.loadingCtrl.create({
               message,
               mode: 'ios',
               duration: 6000
          });

          await loading.present();
     }

     async cancelLoading() {
          await this.loadingCtrl.dismiss();
     }
}