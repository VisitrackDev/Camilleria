import { Component, OnInit } from '@angular/core';
import { TimerService } from '../../Services/Utilities/Timer.service';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { StorageWebService } from '../../Services/Storage/StorageWeb.service';

import * as moment from 'moment-timezone'
@Component({
  selector: 'app-timer-real',
  templateUrl: './timer-real.component.html',
  styleUrls: ['./timer-real.component.scss'],
})
export class TimerRealComponent implements OnInit {

  timerNative = 0;
  txt = 0;
  limit = 0;

  load = true;

  constructor(
    private timer: TimerService,
    private router: Router,
    private storage: StorageWebService,
          private plt: Platform
  ) { 

    this.timer.$time.subscribe((tm) => {
      this.timerNative = tm;
    })

    this.timer.$active.subscribe((tm) => {
      this.load = tm;
    })

 
  }

  async ngOnInit() {
    const active = await this.storage.getActive()
    if (active) {
      if (active.length > 0) {
      

        let valu = active[0].extras.Values.filter((it) => it.apiId === 'TIEMPODERESPUESTA');

        console.log(valu)

        if (valu.length > 0) {
         this.limit = parseFloat(valu[0].Value);
        }

      }
    }
  }

  navigate() {

    this.router.navigate(['/tabs/tab2/form'])

  }

}
