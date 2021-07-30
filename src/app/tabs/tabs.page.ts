import { Component } from '@angular/core';
import { TimerService } from '../Services/Utilities/Timer.service';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { NavController } from '@ionic/angular';
import { NetworkService } from '../Services/Network/Network.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  // keystore camilleria.1  ---- camilleria.11

  active = false;
  events = false;

  color = 'primary';
  red = true;

  r;
  constructor(
    private timer: TimerService,
    private storage: StorageWebService,
    private nav: NavController,
    private network: NetworkService,
    private statusbar: StatusBar
  ) {

      this.timer.$active.subscribe((rs: any) => {
        console.log(rs, 'ACTIVOS')
        this.active = rs;
      })

      this.timer.$events.subscribe((rs: any) => {
        console.log(rs, 'ACTIVOS')
        this.events = rs;
      })

      this.network.$getNetwork.subscribe((data) => {
        this.r = data;
        if (data.includes('disconnected')) {
          this.color = 'danger';
          this.red = false;
          this.statusbar.backgroundColorByHexString('#93362E')
        } else {
          this.red = true;
          this.color = 'primary';
          this.statusbar.backgroundColorByHexString('#3880FF')

        }
      })

  }


  async ionViewWillEnter() {
    console.log('CENTRAL');
    const active = await this.storage.getActive();

    if (active) {
      if (active.length > 0) {
        
        this.timer.Active(true);
      } else {
        
        this.timer.Active(false);
      }
    }

    const event = await this.storage.getEvents();

    if (event) {
      if (event.length > 0) {
        this.nav.navigateRoot(['/tabs/tab5'])
        this.events = true;
      } else {
        this.events = false;
      }
    }
  }

}


// tiempo de realizado el servicio
// tiempo sin recibir servicios
// estados de usuario , disponible y descanso