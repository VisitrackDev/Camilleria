import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { StorageWebService } from './../Services/Storage/StorageWeb.service';
import { ApiService } from './../Services/Api/Api.service';
import { Component } from '@angular/core';
import { TimerService } from '../Services/Utilities/Timer.service';
import * as moment from 'moment-timezone'
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // camilleria.1 y .11

  activitiesList = [];

  load = false;
  img = '';


  scanner = false

  timer = false;

  aditional = false;

  stop = false;
  id;


  constructor(
    private apiService: ApiService,
    private storage: StorageWebService,
    private toas: ToastController,
    private actionSheet: ActionSheetController,
    private loading: LoadingController,
    private router: NavController,
    private timerService: TimerService,
    private activeRoute: ActivatedRoute
     )

  {}

  
  ionViewWillEnter() {
    this.stop = false;

    this.id = this.activeRoute.snapshot.paramMap.get('id');

    this.activo();
    this.login()
    
  }

  doRefresh( event ) {
    this.load = false;
    this.activitiesList = [];
   this.activo().then(() => {
    event.target.complete();
   }).catch(() => {
    event.target.complete();
   })
  }
 

  async changeStatus(data, i) {

    const update = await this.storage.updateForm(this.id);

    if (update) {
      await this.storage.deleteTimerData();

      
      this.timerService.stop();
      this.timerService.closeBar();

      this.router.navigateRoot(['/tabs/tab2/form', this.id]);
    }
  }



  async scannerQR(event, data) {
    if (!this.stop) {


      if(event.next) {
        await this.storage.deleteTimerData();
         this.timerService.stop();
         this.timerService.closeBar();
        const msgg = await this.toas.create({
          message: event.msg,
          duration: 2000
        })
        await msgg.present();
        const update = await this.storage.updateForm(this.id);
  
        if (update) {
          const edit = await this.storage.updateActiveForm({
            api: 'FechallegaOrigen',
            value:  moment().format("YYYY-MM-DD HH:mm:ss"),
            id: this.id
       })
  
       if (edit) {
  
        const login = await this.storage.getLogin();
        if (login) {
          const active = await this.storage.getActive(this.id);
  
          if (active) {
    
            let activity = active[0];

            if (!active[0].extras.validorigen) {

            this.apiService.aceptActivity({
              AccessToken: login[0].AccessToken,
              FormGUID: activity.extras.FormGUID,
              LocationGUID: activity.extras.LocationGUID,
              AssetGUID: activity.extras.AssetGUID,
              UserGUID: login[0].GUID,
              Duration: "60",
              Values: JSON.stringify(activity.extras.Values),
              ActivityGUID: activity.extras.GUID,
              CompanyStatusGUID: '789AD011-C4B1-4A2F-A748-74B9B8904E7C'
            }).subscribe(async (dat: any) => {
            
              if (dat.Status === 'OK') {


                this.apiService.eventRegister(login[0].AccessToken, {
                  event:  59,
                  entity: '1',
                  lat: 0,
                  lng: 0,
                  entityID: event.loc[0].ID
              }).subscribe(async (rs: any) => {
  
                if (rs.Status == 'OK') {
                

                          
              await this.storage.insertPosition(event.loc[0])

              
              const upt = await this.storage.upt(this.activeRoute.snapshot.paramMap.get('id'));

              if (upt) {

                const msgg = await this.toas.create({
                  message: 'Origen Registrado',
                  duration: 5000
                })
      
                await msgg.present();
    
                this.router.navigateRoot(['/tabs/tab2/form', this.activeRoute.snapshot.paramMap.get('id')]);

              }
            
          
            
         
                } else {

                  
                  this.errorMSG('Error al procesar el evento, inténtelo nuevamente')
                
                }
  
  
                 
  
              }, (err) => {

                
                this.errorMSG('Error al procesar el evento, inténtelo nuevamente')
               
              })



    
               
              } else {
      
                const msgg = await this.toas.create({
                  message: 'Error ' + dat.Message,
                  duration: 5000
                })
      
                await msgg.present();
      
              }
      
           })
            }
    
    
            
          }
        }
      
  
       
       }
       //   await this.timerService.start_timer();
       
        }
  
  
      } else {
        const msgg = await this.toas.create({
          message: event.msg,
          cssClass: 'error',
          duration: 5000
        })
  
  
        await msgg.present();
      }
  
    }
  }

  async login () {
    const login = await this.storage.getLogin();

    if (login) {
      this.img = login[0].logo;

    }
  }




  async activo() {

    this.activitiesList = [];

    let active: any = await this.storage.getActive(this.activeRoute.snapshot.paramMap.get('id'));

    if (active) {

      console.log(active, 'ACTIVE')
       if (active.length > 0) {


        
        if (active[0].extras.ExternalID.includes('apoyo') || active[0].extras.ExternalID.includes('Apoyo') || active[0].extras.ExternalID.includes('APOYO')) {

          this.aditional = true;

          

        }
       
        if (active[0].extras.validate) {
          this.timer = false;
        } else {
          this.timer = true;
        }

        const login = await this.storage.getLogin();

        if (login) {
          this.img = login[0].logo;

        }

        const motivo = active[0].extras.Values.filter((it) => {
          return it.apiId.includes('MOTIVOS_');
        })

        console.log(motivo, 'MOTIVO')

        if (motivo.length > 0) {
          if (motivo[0].Value.includes('PACIENTE')) {
            active[0].extras.paciente = true;
          }

          console.log(motivo[0].Value, 'MOTIVO')
        }

      

        this.activitiesList.push(active[0])
       } else {
        this.timer = false;
        // this.router.navigate(['/tabs/tab1'])
       }
    
        this.load = true;
       
      
    }

  }

  
  async errorMSG(msg) {
    const msgg = await this.toas.create({
      message: msg,
      cssClass: 'error',
      duration: 5000
    })


    await msgg.present();
  }



  ionViewWillLeave(){
    this.stop = true;
  }

  
}
