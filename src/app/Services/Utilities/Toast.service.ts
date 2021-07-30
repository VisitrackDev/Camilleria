import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
     providedIn: 'root'
})

export class ToastService {

     constructor(
          private toastCtrl: ToastController
     ) { }

     async newCreatedToast(message: string, status: boolean) {
          const toast = await this.toastCtrl.create({
               message,
               cssClass: status ? 'ok' : 'not',
               header: 'Vt Message',
               duration: 5000
          });

          return await toast.present();
     }

}
