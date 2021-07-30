import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { StorageWebService } from '../Storage/StorageWeb.service';

@Injectable({
     providedIn: 'root'
})

export class TimerService {

    public time = new BehaviorSubject(0)
    public $time = this.time.asObservable();


    public close = new BehaviorSubject(false)
    public $close = this.time.asObservable();

    public active = new BehaviorSubject(false)
    public $active = this.active.asObservable();

    public events = new BehaviorSubject(false)
    public $events = this.events.asObservable();


    public msg = new BehaviorSubject(true)
    public $msg = this.msg.asObservable();

    load;

     constructor(
          private storage: StorageWebService
     ) {

     // this.start_timer()

     }

     start_timer() {
       this.load =  setInterval(async () => {
             // console.log('Holaaaa')
            await this.storage.updateTimer(1);

            const myTimer = await this.storage.getTimer();

            if (myTimer) {
             //   console.log('HOLA EJECUTANDO')
                this.time.next(myTimer)
            }
         }, 1000)
     }

     stop() {

        clearInterval(this.load)
     }

     closeBar() {
       this.time.next(0);
         this.close.next(true)
     }


     Active(status) {
        this.active.next(status)
    }

    Events(status) {
      this.events.next(status)
  }

    Msg(status) {
      this.msg.next(status)
  }

    
}