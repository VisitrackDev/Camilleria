import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { IonSlides, ToastController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/Services/Utilities/Loading.service';
import { StorageWebService } from 'src/app/Services/Storage/StorageWeb.service';
import { TimerService } from '../../../Services/Utilities/Timer.service';
import * as moment from 'moment-timezone'
import { ApiService } from '../../../Services/Api/Api.service';
import { ConnectService } from '../../../Services/Utilities/Connect.service';
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  titleForm = '';
  pages: any[] = [];
  page = 1;

  values  = [];

  pending = false;

  /*
    LocationsTypes:1
  Users:10
  AssetsType:12
  ItemsType:14
  Surveys:4
  ListsType:7
  ListsDet:8
  */

  @Input() response;
  @Input() zone;
  @Input() activity;
  @Input() id;

  @ViewChild('slide') slide: IonSlides;

  
  @Output() propagar = new EventEmitter();

  aditional = false;


  stop = false;
  loadDestiny = false;

  constructor(
    private loading: LoadingService,
    private storage: StorageWebService,
    private router: Router,
    private timerService: TimerService,
    private toas: ToastController,
    private apiService: ApiService,
    private nav: NavController,
    private connect: ConnectService
  ) { }

 ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.stop = true;
    console.log('DESTRUIDO')
  } 

  async ngOnInit() {

    this.stop = false;

    await this.loading.createLoading('Cargando Formulario, por favor espere');
   // console.log(this.response, 'response', this.activity)

  const data = await this.storage.getForm();

  if (data) {

    const dataValues = await this.storage.getActive(this.id);

    if (dataValues) {

      this.values = dataValues[0].extras.Values;

      const demora = this.values.filter((it) => it.apiId === 'DEMORA' )

      if (demora.length > 0) {
        this.pending = true;
      }

      const myForm = this.response;
  

   //   // console.log(myForm, ' entramos', this.zone)
  
      this.titleForm = myForm.Title;
  
      let values = JSON.parse(myForm.Values)
  
     // // console.log(values)
  
      if (this.zone === 'med') {
        values[0].Values = values[0].Values.filter((it) => {
          return !it.apiId.includes('RIO')
        })


      } else if (this.zone === 'rng') {
        values[0].Values = values[0].Values.filter((it) => {
          return !it.apiId.includes('MEDE')
        })
      }

      const motivo = dataValues[0].extras.Values.filter((item) => {
        return item.apiId.includes('MOTIVOS')
      })

      

      if (motivo[0].Value != 'TRANSPORTAR PACIENTE' && !motivo[0].Value.includes('TRANSPORTAR EQUIPOS')) {
        values[0].Values = values[0].Values.filter((it) => {
          return it.apiId !== 'ADICIONAL'
        })
      }

     if (motivo[0].Value != 'TRANSPORTAR PACIENTE') {
        values[0].Values = values[0].Values.filter((it) => {
          return it.apiId !== 'AISLADO' && it.apiId !== 'RECURSOS' && it.apiId !== 'NOMBRE_PACIENTE'
        })

        if (!motivo[0].Value.includes('TRANSPORTAR EQUIPOS')) {
          values[0].Values = values[0].Values.filter((it) => {
            return it.apiId !== 'FOTO' 
          })
        }

        
     } else {
      values[0].Values = values[0].Values.filter((it) => {
        return it.apiId !== 'FOTO'
      })
     }

     values[0].Values = values[0].Values.filter((it) => {
      return it.apiId !== 'TIEMPODERESPUESTA' && it.apiId !== 'PRIORIDAD'
    })

    values[0].Values.map((it) => {
      if (it.apiId === 'OBSERVACIONES1' || it.apiId === 'OBSERVACIONES2' ) {
        it.rea = true;
      }
    })

    values[0].Values.map((it) => {
      if (it.apiId === 'ADICIONAL') {
        it.rea = false;
      }
    })


    if (dataValues[0].extras.ExternalID.includes('apoyo') || dataValues[0].extras.ExternalID.includes('Apoyo') || dataValues[0].extras.ExternalID.includes('APOYO')) {

      this.aditional = true;

      values[0].Values = values[0].Values.filter((it) => {
        return it.apiId === 'FECHA' || it.apiId === 'HORA' || it.apiId === 'TORREPISO_ORG' || it.apiId === 'TORREPISO_DESTINO' || it.apiId === 'NOMBRE' || it.apiId === 'HOSPITAL'  || it.apiId.includes('ORIGEN') || it.apiId.includes('DESTINO_')
      })

    }


    values[0].Values = values[0].Values.filter((it) => {
      return it.apiId !== 'USUARIO_ADMINISTRATIVO' 
    })

    console.log(values, 'todoooo')

    
    await this.loading.cancelLoading();

    this.pages = values[0].Values;
    
      
    //  // console.log(this.pages, 'pages')
  

    }

   

  }




  // const data = await this.storage.

  /* this.titleForm = data[0].Title;
    this.pages = data[0].JSONQuestions;*/}

  async changePage() {
    this.page = await this.slide.getActiveIndex() + 1;
  }

  
  // async close() {

  //   const delet = await  this.storage.deleteActive();

  //   if (delet) {
  //     this.router.navigate(['/tabs/tab1'])
  //   }
  // }

  async pendingEnd() {

    const update = await this.storage.updateActiveForm({
      api: 'Esperafin',
      value: moment().format('YYYY-MM-DD HH:mm:ss'),
      id: this.id
    });

    if (update) {

      this.pending = false;

    }

  }
  async closeByPending(event) {

     if (!this.stop) {
      if (event.status) {

        const info = await this.storage.getLogin();

        if (info) {
    
          const active = await this.storage.getActive(this.id);
    
          if (active) {
    
    
            this.loadDestiny = true;
    
    
            // await this.timerService.stop();
    
            // await this.timerService.closeBar();

           // await this.connect.stopDeletedAutomatic();
    
            let activity = active[0];
    
            this.apiService.aceptActivity({
              AccessToken: info[0].AccessToken,
              FormGUID: activity.extras.FormGUID,
              LocationGUID: activity.extras.LocationGUID,
              AssetGUID: activity.extras.AssetGUID,
              UserGUID: info[0].GUID,
              Duration: "60",
              Values: JSON.stringify(activity.extras.Values),
              ActivityGUID: activity.extras.GUID,
              CompanyStatusGUID: '15395AA4-64B3-467E-8A75-7557B90BB991'
            }).subscribe(async (dat: any) => {
             //  // console.log(dat, activity)
    
            
               
              if (dat.Status === 'OK') {
                activity.extras.CompanyStatusName = 'Completado'
             //   await loading.dismiss();
          


                const data = await this.storage.getPosition();

                if (data) {
            
              
                  console.log(data);
            
                  if (data.length > 0) {
            
                    this.apiService.eventRegister(info[0].AccessToken, {
                      event: 58,
                      lat: 0,
                      lng: 0,
                      entity: '1',
                      entityID: data[0].ID
                  }).subscribe(async (rs) => {
        
                    await this.storage.deleteActive(this.id);
        
                    await this.nav.navigateRoot(['/tabs/tab1']);
            
                    await  this.propagar.emit({
                       next: true
                     })
         

                     this.loadDestiny = false;
                     const msgg = await this.toas.create({
                       message: 'Solicitud guardada correctamente',
                       duration: 5000
                     })
           
                     await msgg.present();
        
                  }, async (err) => {

                    this.loadDestiny = false;
                    const msgg = await this.toas.create({
                      message: 'Solicitud guardada correctamente',
                      duration: 5000
                    })
          
                    await msgg.present();
                    //  this.changeStatus(false);
                  })
            
                  } else {

                    this.loadDestiny = false;
                    const msgg = await this.toas.create({
                      message: 'Solicitud guardada correctamente',
                      duration: 5000
                    })
          
                    await msgg.present();
            
                  }
            
                }
    
    
                
        
               
    
          
    
      
        
               
              } else {
    
                this.loadDestiny = false;
      
                const msgg = await this.toas.create({
                  message: 'Error ' + dat.Message,
                  duration: 5000
                })
      
                await msgg.present();
      
              }
      
           })
            
          }
    
         
    
        }
      } else {
        this.pending = true;
      }
     }

  }


  
  async scannerQR(event) {
    // console.log(event, 'evento')

    if (!this.stop) {
      if(event.next) {

        const mssgg = await this.toas.create({
          message: event.msg,
          duration: 2000
        })
  
  
        await mssgg.present();
  
        const update = await this.storage.updateActiveForm({
          api: 'FechaLlegadaDestino',
          value: moment().format('YYYY-MM-DD HH:mm:ss'),
          id: this.id
        });
  
        if (update) {
  
          const info = await this.storage.getLogin();
  
          if (info) {
  
            const active = await this.storage.getActive(this.id);
  
            if (active) {
  
  
              this.loadDestiny = true;
  
              let activity = active[0];
      
              this.apiService.aceptActivity({
                AccessToken: info[0].AccessToken,
                FormGUID: activity.extras.FormGUID,
                LocationGUID: activity.extras.LocationGUID,
                AssetGUID: activity.extras.AssetGUID,
                UserGUID: info[0].GUID,
                Duration: "60",
                Values: JSON.stringify(activity.extras.Values),
                ActivityGUID: activity.extras.GUID,
                CompanyStatusGUID: '91330DB9-334E-42B5-8E94-05ABD9EE1C4A'
              }).subscribe(async (dat: any) => {
               //  // console.log(dat, activity)
  
                 
                if (dat.Status === 'OK') {


                  
                  this.apiService.eventRegister(info[0].AccessToken, {
                    event:  58,
                    entity: '1',
                    lat: 0,
                    lng: 0,
                    entityID: event.loc[0].ID
                }).subscribe(async (rs: any) => {
    
                  if (rs.Status == 'OK') {
                 
                            
                await this.storage.insertPosition(event.loc[0])

               // await this.connect.stopDeletedAutomatic();
                activity.extras.CompanyStatusName = 'Completado'
             //   await loading.dismiss();
                this.loadDestiny = false;
                    const msgg = await this.toas.create({
                      message: 'Solicitud guardada correctamente',
                      duration: 5000
                    })
      
                await msgg.present();

  
                
           const del =  await this.storage.deleteActive(this.id);

           if (del) {
           // await this.storage.deleteTimerData();
    
               
    
    
      
            await this.nav.navigateRoot(['/tabs/tab1']);

           await  this.propagar.emit({
              next: true,
            })

           }
          
           
    
                    console.log(rs)
                  } else {
                    this.loadDestiny = false;
                  this.errorMSG('Error al procesar el evento, inténtelo nuevamente')
                  }
    
    
                   
    
                }, (err) => {
                  this.loadDestiny = false;
                  this.errorMSG('Error al procesar el evento, inténtelo nuevamente')
                })

  
                
                 
                } else {
  
                  this.loadDestiny = false;
        
                  const msgg = await this.toas.create({
                    message: 'Error, no se pudo sincronizar ' + dat.Message,
                    duration: 5000
                  })
        
                  await msgg.present();
        
                }
        
             })
              
            }
  
           
  
          }
  
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


  async errorMSG(msg) {
    const msgg = await this.toas.create({
      message: msg,
      cssClass: 'error',
      duration: 5000
    })


    await msgg.present();
  }

}
