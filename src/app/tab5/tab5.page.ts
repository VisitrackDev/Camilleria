import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
import { TimerService } from '../Services/Utilities/Timer.service';
import { ApiService } from '../Services/Api/Api.service';
import * as  moment from 'moment-timezone'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  loader;

  minute = 0;

  stop = false;

  constructor(
    private storage: StorageWebService,
    private timerr: TimerService,
    private nav: NavController,
    private api: ApiService,
    private toas: ToastController,
    private loading: LoadingController,
    private plt: Platform
  ) {

    this.plt.resume.subscribe(() => {
    if (!this.stop) {
      this.getMinute();
    }
    })

   }

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.stop = false;

    this.getMinute();

  }

  async getMinute() {
    const active = await this.storage.getDesc();

    if (active) {
      if (active.length > 0) {

        const init = moment(active[0].descanso).format('YYYY-MM-DD HH:mm');
        const end = moment().format('YYYY-MM-DD HH:mm');

        const diff = moment(end).diff(moment(init), 'minutes');

        this.minute = diff;

      }
    }
  }

  async markerDes() {

    this.loader = await this.loading.create({
      message: 'Entrando de descanso...',
      mode: 'ios',
      duration: 5000
    })

    await this.loader.present();
   

      const login = await this.storage.getLogin();

      if (login) {

      this.api.eventRegister(login[0].AccessToken, {
          event: 61,
          lat: 0,
          lng: 0,
          entity: '10',
          entityID: login[0].UserID
      }).subscribe(async (rs: any) => {

        console.log(rs)

        if (rs.Status == 'OK') {
          
        const marker = await this.storage.deleteEvents();

        if (marker) {
        const eli =  await this.storage.deleteDesc();
       

        if (eli) {
          this.timerr.Events(false);
       
          this.nav.navigateRoot(['/tabs/tab1'])
  
          this.loader.dismiss();
  
        }
        }

        } else {
          this.loader.dismiss();
          const msgg = await this.toas.create({
            message: 'No se proceso la solicitud, inténtelo nuevamente',
            duration: 5000
          })
  
          await msgg.present();
        }


      }, async (err) => {
        //  this.changeStatus(false);
        this.loader.dismiss();
        const msgg = await this.toas.create({
          message: 'No se proceso la solicitud, inténtelo nuevamente',
          duration: 5000
        })

        await msgg.present();
      })

  }
     
    
  }


  ionViewWillLeave() {
    this.stop = true;
  }

}
