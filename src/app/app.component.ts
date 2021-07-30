import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { DataComparnyService } from './Services/dataCompany.service';
import { ConnectService } from './Services/Utilities/Connect.service';
import * as moment from 'moment-timezone'
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NotificationsService } from './Services/Utilities/push.service';
import { ApiService } from './Services/Api/Api.service';
import { NetworkService } from './Services/Network/Network.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private storage: Storage,

     private platform: Platform,
     private dataCompany: DataComparnyService,
     private conexion: ConnectService,
     private statusbar: StatusBar,
     private notificacion: NotificationsService,
     private apiService: ApiService,
     private network: NetworkService
  ) {
  }



  async stopOperation() {
    const login = await this.storage.get('login');


    if (login) {

      const active = await this.storage.get('active');


      if (active) {
        if (active.length > 0) {
          if (!active[0].extras.validate) {

            this.apiService.eventRegister(login[0].AccessToken, {
              event: 22,
              entity: '1',
              lat: 0,
              lng: 0,
              entityID: -1
          }).subscribe((rs: any) => {
      
            if (rs.Status == 'OK') {
      
              this.closeSessionByAssigned();
             
            } else {
              
              this.closeSessionByAssigned();
            }
      
          }, (err) => {
           
            this.closeSessionByAssigned();
          })

          }
        }
      }
    
    }
  }


  closeSessionByAssigned() {
    this.storage.set('login', []);
    this.storage.set('active', []);
    this.storage.set('position', []);
    this.storage.set('time', 0);

    this.storage.set('events', []);
    this.storage.set('device', []);
    this.storage.set('desc', []);
    this.storage.set('form', []);
  }
  
  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const platforms = this.platform.platforms();

      this.statusbar.backgroundColorByHexString('#3880FF')

      this.notificacion.configuracionInicial();

      // if (platforms.includes('desktop')) {
      this.createdCollections().then(() => {
          console.log('Creado');
        }).catch((err) => {
          console.log('Error ', err);
        });
      // }
    });
  }

  async createdCollections() {
    console.log('Holaaa')
    const login = await this.storage.get('login');
    const forms = await this.storage.get('forms');
    const formsActive = await this.storage.get('active');
    const chats = await this.storage.get('chats');
    const position = await this.storage.get('position');

    const form = await this.storage.get('form');
    const list = await this.storage.get('list');
    const timer = await this.storage.get('timer');
    const events = await this.storage.get('events');

    const desc = await this.storage.get('desc');

    const device = await this.storage.get('device');

    if (!login) {
      console.log('ESCEL')
      await this.storage.set('login', []);
    } else {
      if (login.length > 0) {
          this.dataCompany.getDataCompany({
            pathLogoCompany: login[0].logo,
            nameCompany: login[0].companyName,
            ext: login[0].type === 'exter' ? true : false
          });

        
      }
    }

    if (!desc) {
      await this.storage.set('desc', []);
    }


    
    if (!events) {
      await this.storage.set('events', []);
    }

    if (!forms) {
      await this.storage.set('forms', []);
    }
    if (!timer) {
      await this.storage.set('timer', []);
    }

    if (!form) {
      await this.storage.set('form', []);
    }


    if (!list) {
      await this.storage.set('list', []);
    }

    if (!formsActive) {
      await this.storage.set('active', []);
    } else {
      if (formsActive.length > 0) {
        this.conexion.deletedAutomatic();
        const init = moment(formsActive[0].extras.CreatedOn).format('YYYY-MM-DD HH:mm:ss');
        const end = moment().format('YYYY-MM-DD HH:mm:ss');
        const diff = moment(end).diff(moment(init), 'seconds');
        this.storage.set('timer', diff).then(() => {

          this.conexion.execTimer();
      });

      }
    }

    if (!chats) {
      await this.storage.set('chats', []);
    }

    if (!position) {
      await this.storage.set('position', []);
    }

    if (!device) {
      await this.storage.set('device', []);
    }

  }
}
