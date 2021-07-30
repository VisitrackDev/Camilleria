import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
@Injectable({
    providedIn: 'root'
})

export class NotificationsService {

    usuarioIDSubject = new BehaviorSubject('sin id');
    $usuarioID = this.usuarioIDSubject.asObservable();

    constructor(
        private oneSignal: OneSignal,
        private router: Router,
        private vibration: Vibration
    ) { }

    configuracionInicial() {
       try{
           
        console.log('Entro a la notificación')
        this.oneSignal.startInit('0f446df0-957f-4229-aff6-421d0e21560a', '803796084830');

        this.oneSignal.getIds().then((data) => {
            this.usuarioIDSubject.next(data.userId);
            console.log('User ID', data.userId);
        });


        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived().subscribe((noti) => {
         // do something when notification is received
         console.log(noti);

        });

        this.oneSignal.handleNotificationOpened().subscribe((noti) => {
          // do something when a notification is opened
          console.log(noti.notification.payload.additionalData.tipo);
          const notificacion = noti.notification.payload.additionalData;
          this.detectarCambio(notificacion);

        });

        this.oneSignal.endInit();
       } catch (error) {
            console.log('No permitido servicio');
       }
    }

    detectarCambio(data: any) {
        console.log(data);
        if (data.tipo === 'Seguimiento') {
            this.router.navigate(['/central/menu/solicitudes']);
        } 


    }
}
