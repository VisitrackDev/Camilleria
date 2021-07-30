

import { Injectable } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { StorageWebService } from '../Storage/StorageWeb.service';

import * as moment from 'moment-timezone'
import { TimerService } from './Timer.service';
import { ApiService } from '../Api/Api.service';
import { ToastService } from './Toast.service';
@Injectable({
     providedIn: 'root'
})

export class ConnectService {

    interval;


    delete = new BehaviorSubject(null);
    $delete = this.delete.asObservable()


     constructor(
          private storage: StorageWebService,
          private plt: Platform,
          private timer: TimerService,
          private api: ApiService,
          private nav: NavController,
          private toas: ToastController,
          private toasService: ToastService
     ) {

     // this.start_timer()

        this.escucharEntrada();
        this.escucharFondo();

        this.deletedAutomatic();

     }

    //  async close() {
    //      console.log('ENTRANDO AL CONTRUCTOR CLOSE')
    //     const login = await this.storage.getLogin();

    //     if (login) {
    //         if (login.length > 0) {
               
    //             this.api.postLogin({user: login[0].Login, password: '1234', device: login[0].device}).subscribe(async (data: any) => {
    //                     console.log(data, ' ULTIMAS LINEAS')
    //                 if (data.status === 'Error') {
    //                     this.toasService.newCreatedToast('No se pudo consultar la sesión', false);
    //                   } else {
    //                   // await this.storage.closeSession();
    //                   }
   
    //             })
   
    //         }
    //     }
    //  }

    deletedAutomatic() {
        this.interval =  setInterval(async () => {
          //  console.log('cada 30 segundos')

            const login = await this.storage.getLogin();

            if (login) {

                
              if (login.length > 0) {
                this.api.getDeviceID(login[0].AccessToken).subscribe(async (res: any)  => {
                  //  console.log(res, '')
            
                    const device = await this.storage.getDevice();
            
                    if (device) {
                      if (device.length > 0) {
            
                        if (res.DeviceID !== device[0] && res.LastEventID !== '') {
                          this.msgError('Su usuario esta utilizando la app desde otro dispositivo o fue liberado, la sesión será finalizada')
                            this.closeSession();
                        }

                    }
                }

                })

    
            const active = await this.storage.getActive();
    
            if (active) {
                if (active.length > 0) {
                    

                    active.forEach(async element => {
                        const id = element.ID;

                  


                        this.api.isDeleted(login[0].AccessToken, {ID: id}).subscribe(async(data: any) => {
                            console.log(data, 'delete')
                            

                            if (data.isDeleted) {
                                this.timer.stop();
                                this.timer.closeBar();
                                this.timer.Active(false);
                                this.timer.Msg(false);
                               
                                await this.storage.deleteActive(id);
                               
                                await this.storage.deleteTimerData();
                                this.delete.next(id);
                                const msgg = await this.toas.create({
                                    message: 'Solicitud cancelada '+ id,
                                    duration: 5000
                                  })
                      
                        
                                  await msgg.present();
                            }
                        })
                    
                    });
    
                   // 
                

                //   this.stopDeletedAutomatic();
                } 
            }
              }

        }
         }, 40000);
    }

    deleteActivity() {

    }

     
  async msgError(msg) {
    const msgg = await this.toas.create({
      message: msg,
      cssClass: 'error',
      duration: 5000
    })


    await msgg.present();
  }


    stopDeletedAutomatic() {
        clearInterval(this.interval);
    }


     escucharFondo() {
        return this.plt.pause.subscribe( async (e) => {
              // this.timer.stop()
        });
    }
    
    escucharEntrada() {
        return this.plt.resume.subscribe( async (e) => {
           
            
          
        });
    
    }

    execTimer(){
        this.timer.start_timer();
    }


    closeSession() {
        this.storage.closeSession().then(async () => {
          await this.storage.deleteActiveAll();
          await this.storage.deleteTimerData();
          await this.storage.deleteForm();
          await this.storage.deletePosition();
            await this.nav.navigateRoot('/login');
        }).catch(async() => {
          const msgg = await this.toas.create({
            message: 'No se pudo cerrar sesion'
          })
    
          await msgg.present();
    
    
        })
      }
    
}