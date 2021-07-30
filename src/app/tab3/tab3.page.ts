import { ApiService } from './../Services/Api/Api.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { StorageWebService } from './../Services/Storage/StorageWeb.service';
import { Component } from '@angular/core';
import { TimerService } from '../Services/Utilities/Timer.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  validposition = false;
  cod = ''
  location;
  img = '';
  user = '';
  iduser = '';
  timer = false;

  loader;

  stop = false;
  pending = false;

  constructor(
    private storage: StorageWebService,
    private nav: NavController,
    private toas: ToastController,
    private apiService: ApiService,
    private loading: LoadingController,
    private timerr: TimerService
  ) {}


  ionViewWillEnter() {

    this.stop = false;

    this.activo();
    this.login();

    this.position();
  }


  async timeDesc() {
    const marker = await this.storage.insertEvent('descanso');

    if (marker) {
     // await this.loader.dismiss();
      await this.storage.deleteActiveAll();
      await this.storage.deleteTimerData();
      


  this.timerr.stop();
  this.timerr.closeBar();

  this.timerr.Active(false);

    this.timerr.Events(true);
    this.timerr.Msg(false)

    const uptDesc = await this.storage.DescUpdate();

    if (uptDesc) {
      this.nav.navigateRoot(['/tabs/tab5'])

      const msgg = await this.toas.create({
        message: 'Solicitud reasignada',
        duration: 5000
      })

      await msgg.present();
    }
    

  }
  }

  async eventDesc(login,cod) {
    this.apiService.eventRegister(login[0].AccessToken, {
      event: cod,
      lat: 0,
      lng: 0,
      entity: '10',
      entityID: login[0].UserID
  }).subscribe(async (rs: any) => {

    if (rs.Status == 'OK') {

    this.timeDesc();

    } else {

      this.eventDesc(login, cod);
    }

  

}, async (err) => {
  //  this.changeStatus(false);

  this.eventDesc(login, cod);

  await this.loader.dismiss();
  this.msgError('No se proceso la solicitud, inténtelo nuevamente');
  
})
  }

  async markerDes() {
  

    this.loader = await this.loading.create({
      message: 'Entrando a descanso...',
      mode: 'ios',
      duration: 5000
    })

    await this.loader.present();
   

      const active = await this.storage.getActive();

      if (active) {

        if (active.length > 0) {

          const pendings = active.filter((it) => {
            return it.extras.validate;
          })

          if (pendings.length > 0) {

            await this.loader.dismiss();

            const msgg = await this.toas.create({
              message: 'Usted tiene ' + pendings.length + ' servicios sin terminar, debe finalizar todo para tomar su descanso ',
              duration: 5000
            })
  
            await msgg.present();
          } else {

            const login = await this.storage.getLogin();

            if (login) {
        
         
              
          

            // var torre = active[0].extras.Values.filter((it) => {
            //   return it.apiId.includes('TORREPISO_ORG')
            // })

            // var prioridad = active[0].extras.Values.filter((it) => {
            //   return it.apiId.includes('PRIORIDAD')
            // })

            // var priori = 1;

            // if (prioridad.length > 0) {
            //     priori = parseFloat(prioridad[0].Value)
            // }


            this.apiService.eventRegister(login[0].AccessToken, {
              event: 60,
              lat: 0,
              lng: 0,
              entity: '10',
              entityID: login[0].UserID
          }).subscribe(async (rs: any) => {
        
            if (rs.Status == 'OK') {


              // this.apiService.reasigned(login[0].AccessToken, {ID: active[0].extras.ID,  value: '1|' + torre[0].Value + '|web',  priority: priori} ).subscribe(async (r: any) => {


              //   await this.loader.dismiss();
        
              //   if (r[0].Status === 'Error') {
                 
  
              //     this.msgError('No se pudo reasignar el servicio, inténtelo nuevamente');
              //   } else {
  
                 
        
            this.timeDesc();
                
        
                
        
            } else {
        
              this.eventDesc(login, 61);
            }
        
          
        
        }, async (err) => {
          //  this.changeStatus(false);
        
          this.eventDesc(login, 61);
        
          await this.loader.dismiss();
          this.msgError('No se proceso la solicitud, inténtelo nuevamente');
          
        })


         

        
      
      }
      
          }

        } else {


          const login = await this.storage.getLogin();

          if (login) {

          this.apiService.eventRegister(login[0].AccessToken, {
            event: 60,
            lat: 0,
            lng: 0,
            entity: '10',
          entityID: login[0].UserID
        }).subscribe(async (rs) => {


          const marker = this.storage.insertEvent('descanso');

          if (marker) {
    
         
            await this.loader.dismiss();
      
    
          this.timerr.Events(true);
          this.timerr.Msg(false)

          const uptDesc = await this.storage.DescUpdate();

          if (uptDesc) {
            this.nav.navigateRoot(['/tabs/tab5'])

      
          }
          


          }


        }, async (err) => {
          //  this.changeStatus(false);
      
          await this.loader.dismiss();
      
          const msgg = await this.toas.create({
            message: 'No se proceso la solicitud, inténtelo nuevamente',
            duration: 5000
          })
    
          await msgg.present();
        })

      

      

        }

        }
      

    
      }



  
  }

  
  async activo() {

    let active: any = await this.storage.getActive();

    if (active) {

      console.log(active, 'ACTIVE')

       if (active.length > 0) {
        if (active[0].extras.validate) {
          this.timer = false;
          this.pending = true;
        } else {
          this.timer = true;
          this.pending = false;
        }
       } else {
        this.timer = false;
        this.pending = false;
       }
    

       
      
    }

  }





  async login () {
    const lg = await this.storage.getLogin();

    if (lg) {

      this.user = lg[0].DisplayName;
      this.iduser = lg[0].UserID;
      
      this.img = lg[0].logo;
    }
  }

  async position() {
    const data = await this.storage.getPosition();

    if (data) {

  
      console.log(data);

      if (data.length > 0) {

        this.validposition = true;

        this.location = {
          name: data[0].Name,
          torre: data[0].Values[0].Value,
          piso: data[0].Values[1].Value
        }

      } else {

        this.validposition = false;

      }

    }
  }

  async Markposition() {
    const login = await this.storage.getLogin();

    
    const loading = await this.loading.create({
      message: 'Comprobando codigo, por favor espere',
      duration: 5000
    })

    await loading.present();

    if (login) {

      this.apiService.markPosition(login[0].AccessToken, this.cod).subscribe(async (res: any) => {
        console.log(res)
        if (res.length > 0) {

          if(res[0].Status && res[0].Status.includes('Error')) {

            const msgg = await this.toas.create({
              message: 'El codigo no es valido, por favor verificar QR',
              cssClass: 'error',
              duration: 5000
            })

            await loading.dismiss();
    
            await msgg.present();
          

          } else {

            await this.storage.insertPosition(res[0])
           
            await loading.dismiss();
            this.position();

          }

       
       
      } else {
        const msgg = await this.toas.create({
          message: 'El codigo no es valido, por favor verificar QR',
          cssClass: 'error',
          duration: 5000
        })

        await msgg.present();
        await loading.dismiss();
      }

      })
      
    }
  }

  
  async scannerQR(event) {

    if (!this.stop) {

      const active = await this.storage.getActive();

      if (active) {

        if (active.length > 0) {

          const pendings = active.filter((it) => {
            return it.extras.validate;
          })

          if (pendings.length > 0) {

            await this.loader.dismiss();

            const msgg = await this.toas.create({
              message: 'Usted tiene ' + pendings.length + ' servicios sin terminar, debe finalizar todo para cerrar sesión ',
              duration: 5000
            })
  
            await msgg.present();
          } else {

            if(event.next) {

              const msgg = await this.toas.create({
                message: 'código destino válido',
                duration: 2000
              })
        
        
              await msgg.present();

              const login = await this.storage.getLogin();

              if (login) {

                 
            //       var torre = active[0].extras.Values.filter((it) => {
            //         return it.apiId.includes('TORREPISO_ORG')
            //       })
      
            //       var prioridad = active[0].extras.Values.filter((it) => {
            //         return it.apiId.includes('PRIORIDAD')
            //       })
      
      
            //       var priori = 1;

            // if (prioridad.length > 0) {
            //     priori = parseFloat(prioridad[0].Value)
            // }

            this.apiService.eventRegister(login[0].AccessToken, {
              event: 22,
              entity: '1',
              lat: 0,
              lng: 0,
              entityID: event.id
          }).subscribe((rs: any) => {

            if (rs.Status == 'OK') {


          this.closeSession();
             
            } else {
              
              this.msgError('No se pudo cambiarel estado,inténtelo nuevamente')
            }

          }, (err) => {
           
            this.msgError('No se pudo cambiarel estado,inténtelo nuevamente')
          })


           
               
            
            


        

          }
        
        
             // const update = await this.storage.updateForm();
            
   
        
            } else {
              const msgg = await this.toas.create({
                message: event.msg,
                cssClass: 'error',
                duration: 5000
              })
        
        
              await msgg.present();
            }

           

           
      
          }

        } else {

          if(event.next) {

            const login = await this.storage.getLogin();

            if (login) {
              this.apiService.eventRegister(login[0].AccessToken, {
                event: 22,
                entity: '1',
                lat: 0,
                lng: 0,
                entityID: event.id
            }).subscribe(async (rs: any) => {
  
              if (rs.Status == 'OK') {
                const msgg = await this.toas.create({
                  message: event.msg,
                  duration: 2000
                })
          
          
                await msgg.present();
          
               this.closeSession();
             
              } else {
                this.msgError('No se pudo capturar el evento de cerrar sesión, por favor inténtelo nuevamente.')
              
              }
  
  
               
  
            }, (err) => {
              this.msgError('No se pudo capturar el evento de cerrar sesión, por favor inténtelo nuevamente.')
             
            })
  
          
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
    }

  }


  async msgError(msg) {
    const msgg = await this.toas.create({
      message: msg,
      cssClass: 'error',
      duration: 5000
    })


    await msgg.present();
  }

 async  closeSessionByAssigned() {
    const msgg = await this.toas.create({
      message: 'Solicitud reasignada',
      duration: 5000
    })

    await msgg.present();

      
  this.timerr.stop();
  this.timerr.closeBar();
  this.timerr.Active(false);

    this.closeSession();
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

  ionViewWillLeave(){
    this.stop = true;
    this.pending = false;
  }

}
