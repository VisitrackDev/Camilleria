import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageWebService } from '../../Services/Storage/StorageWeb.service';
import { ToastService } from '../../Services/Utilities/Toast.service';
import { LoadingService } from '../../Services/Utilities/Loading.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from '../../Services/Api/Api.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { GPSService } from '../../Services/Utilities/GPS.service';
import  *  as moment from 'moment-timezone';
import { ConnectService } from 'src/app/Services/Utilities/Connect.service';
import { TimerService } from 'src/app/Services/Utilities/Timer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marcacion',
  templateUrl: './marcacion.component.html',
  styleUrls: ['./marcacion.component.scss'],
})
export class MarcacionComponent implements OnInit {

  @Input() color;
  @Input() txt;
  @Input() compare;
  @Input() type;
  @Input() lg;
  @Input() pending;
  @Output() propagar = new EventEmitter();

  cod = 'MED6'
 
  constructor(
    private storage: StorageWebService,
    private toas: ToastController,
    private loading: LoadingController,
    private apiService: ApiService,
    private qr: BarcodeScanner,
    private Gps: GPSService,
    private toastService: ToastService,
    private connect: ConnectService,
    private timerr: TimerService,
    private router: Router,
    private nav: NavController,
    private api: ApiService
  ) { 

    // this.Gps.$listenStatus.subscribe((data) => {
    //   if (data) {
       
        

    //    this.Gps.changeStatus(false);
      
    //   }
    // })
  }

  ngOnInit() {

  }

  // Markposition() {
  //   console.log(this.compare)
  //   this.propagar.emit({
  //     next: true,
  //     msg: 'Código válido'
  //   })
  // }

  init() {

    if (this.type === 'login') {
      this.apiService.postLogin(this.lg).subscribe(async (data: any) => {
  
        console.log(data, 'sdds', this.lg);

        if (data.status === 'Error') {
          this.toastService.newCreatedToast(data.message, false);
        } else {
          data.password = this.lg.password;
          data.device = this.lg.device;
       
          await this.toastService.newCreatedToast('Iniciando', true)
          this.storage.insertUser(data).then(async () => {
            const login = await this.storage.getLogin();

            if (login) {
        
              // // // console.log(login)
              this.apiService.getDeviceID(login[0].AccessToken).subscribe(async (res: any)  => {
                console.log(res, '')
        
                const device = await this.storage.getDevice();
        
                if (device) {
                  if (device.length > 0) {
        
                    if ((res.DeviceID !== device[0] || res.DeviceID === device[0] ) && ( res.LastEventID !== '')) {
        
        
                      if (res.LastEventID == '22') {
                        this.Markposition();
        
                      } else if (res.LastEventID == '60') {
                        this.api.eventRegister(login[0].AccessToken, {
                          event: 61,
                          lat: 0,
                          lng: 0,
                          entity: '10',
                          entityID: login[0].UserID
                      }).subscribe(async (rs: any) => {
                
                        console.log(rs)
                
                        if (rs.Status == 'OK') {
                          
                      
                        const eli =  await this.storage.deleteDesc();
                       
                
                        if (eli) {
                          this.timerr.Events(false);
                       
                          this.nav.navigateRoot(['/tabs/tab1'])
                  
                        }
                      
                        } else {
                         
                        }
                
                
                      }, async (err) => {
                       
                      })
                
                      
                      }  else {
                        this.nav.navigateRoot(['/tabs/tab1'])
                      }
                    
        
                    } else {
                     
                      this.Markposition();
                    } 

                  }

                }
                
                })

              }

            
              
          })

         
         // this.Markposition();
        }
        // data.login = this.login.user;
        // data.name = data.FirstName + ' ' + data.LastName;

        

        // console.log(data, 'datica');

     
    }, (err) => {
        this.toastService.newCreatedToast(err, true);
    });
    } else {
      this.Markposition();
    }
  }

  async Markposition() {

    
    const login = await this.storage.getLogin();

    
  

    if (login) {

        this.qr.scan().then(async (bar) => {
        
          this.apiService.markPosition(login[0].AccessToken, bar.text).subscribe(async (res: any) => {
           
           if (res.length > 0) {
   
             if(res[0].Status && res[0].Status.includes('Error')) {
   
               const msgg = await this.toas.create({
                 message: 'El codigo no es valido, por favor verificar QR',
                 cssClass: 'error',
                 duration: 5000
               })
   
       
               await msgg.present();
            
   
             } else {
   
               await this.storage.insertPosition(res[0])
              
              // this.position();
   
              if (this.type === 'login') {

                  this.apiService.eventRegister(login[0].AccessToken, {
                    event: 21,
                    entity: '1',
                    lat: 0,
                    lng: 0,
                    entityID: res[0].ID
                }).subscribe((rs: any) => {
    
                  if (rs.Status == 'OK') {
                    this.propagar.emit({
                      next: true,
                      msg: 'Bienvenido a camillería'
                    })
    
                    console.log(rs)
                  } else {
                    this.propagar.emit({
                      next: false,
                      msg: 'Error al procesar el evento, inténtelo nuvamente' + JSON.stringify(rs)
                    })
                  }
    
    
                   
    
                }, (err) => {
                  this.propagar.emit({
                    next: false,
                    msg: 'Error al procesar el evento, inténtelo nuvamente' + JSON.stringify(err)
                  })
                })
                  // this.Gps.checkPermission({
                  //   event: 21,
                  //   entityID: res[0].ID
                  // });
                
           
              } else if (this.type === 'logout') {
               
                if (this.pending) {
                  this.propagar.emit({
                    next: false,
                    msg: 'No puede cerrar sesión'
                  })
                } else {

                 
                    this.propagar.emit({
                      next: true,
                      id: res[0].ID,
                      msg: 'Nos vemos pronto, Hasta Luego'
                    })
    
                  
                  
                  }
              
              } else {
                if ( res[0].Name === this.compare) {

                  this.propagar.emit({
                    next: true,
                    msg: 'Código Válido',
                    loc: res
                  })

           
          
                
                } else {
     
                 this.propagar.emit({
                   next: false,
                   msg: 'El código escaneado no corresponde al origen de la solicitud'
                 })
               
     
                }
     
              }
              
   
             }
   
          
          
         } else {

          if (this.type === 'login') {

          const deleteLogin = await this.storage.deleteLogin();

          if (deleteLogin) {
           const msgg = await this.toas.create({
             message: 'El codigo no es valido, por favor verificar QR',
             cssClass: 'error',
             duration: 5000
           })
   
           await msgg.present()

          }
         }else {
          const msgg = await this.toas.create({
            message: 'El codigo no es valido, por favor verificar QR',
            cssClass: 'error',
            duration: 5000
          })
  
          await msgg.present()

        }

        } 
   
         })
         
 
       //   // hide camera preview
        //  scanSub.unsubscribe(); // stop scanning
        
 
       // start scanning
   
   
  })
  .catch(async (e: any) => {

    if (this.type === 'login') {

      const deleteLogin = await this.storage.deleteLogin();

      if (deleteLogin) {
       const msgg = await this.toas.create({
         message: 'El codigo no es valido, por favor verificar QR',
         cssClass: 'error',
         duration: 5000
       })

       await msgg.present()

      }
    } else {
 
      const msgg = await this.toas.create({
        message: 'Error al intentar escanear el QR' + e,
        cssClass: 'error',
        duration: 5000
      })
    
      await msgg.present()
    }

   

  
  }
  
  
  );

 
    }
  }



}



/* else  if (res.LastEventID == '59') {
                        
                        this.apiService.getMyActivities(login[0].AccessToken).subscribe((data: any) => {
   
                          console.log(data , 'GENERAL')
                       
                      
                  
                           if (data.length > 0) {
                            data = data.filter((it) => {
                              return it.CompanyStatusID == '23568' && it.AssignedToName == login[0].DisplayName;
                            })
                  
                  
                  
                         if (data.length > 0) {

                          let cont = data.length;

                          let myActivities = [];
                  
                  
                          data.forEach((item) => {
                            new Promise ((resolve, reject) => {
                                this.apiService.getActivitieInfo(login[0].AccessToken, item.GUID).subscribe((res) => {
                                  item.extras = res;
                                  item.extras.validate = false;
                  
                                 console.log('ZONAS', res)
                  
                                  if (login[0].WorkzoneID === '6842') {
                                    // console.log('SALIO')
                                    item.extras.zone = 'med';
                                    const prioridad = item.extras.Values.filter((it) => {
                                      return it.apiId.includes("PRIORIDAD");
                                    })
                  
                                    if (prioridad.length > 0) {
                                      item.extras.prioridad = prioridad[0].Value;
                  
                                    } else {
                                      item.extras.prioridad = 1000;
                  
                                    }
                  
                  
                                    console.log(prioridad, 'medellin')
                  
                  
                                  
                                  } else  if (login[0].WorkzoneID === '6993') {
                                    item.extras.zone = 'rng';
                                    const prioridad = item.extras.Values.filter((it) => {
                                      return it.apiId.includes("PRIORIDAD");
                                    })
                  
                  
                                    console.log(prioridad, 'medellin')
                  
                  
                  
                                    if (prioridad.length > 0) {
                                      item.extras.prioridad = prioridad[0].Value;
                  
                                    } else {
                                      item.extras.prioridad = 1000;
                  
                                    }
                  
                                  
                                  }
                                  resolve({work: login[0].WorkzoneID});
                                }, (err) => {
                                  reject(true);
                                })
                            }).then(async (rs: any) => {
                              if (rs) {
                                cont = cont - 1;
                  
                                if (cont === 0) {
                                  myActivities = data;
                                
                                  console.log(myActivities)
                  
                  
                                  myActivities = myActivities.filter((tr) => {
                                    let orig = tr.extras.Values.filter(u => {
                                      return u.apiId.includes('FechallegaOrigen')
                                    })
                  
                                    console.log('destiny', orig)
                  
                                    if (orig.length > 0) {
                  
                                      if (orig[0].Value !== '') {
                                        return tr;
                                      }
                                     
                                    } 
                                  })

                                  if (myActivities.length > 0) {

                                    myActivities[0].extras.validate = true;
                                      
                              //    const is =  await this.storage.insertActive([myActivities[0]]);
                  
                              //    if (is) {
                                 
                  
                              //  const msgg = await this.toas.create({
                              //   message: 'Solicitud Aceptada correctamente',
                              //   duration: 5000
                              // })
                  
                    
                              // await msgg.present();
                  
                              //  this.timerr.Active(true);
                           
                              //  this.router.navigate(['/tabs/tab2'])
                  
                              //  myActivities = [];
                  
                              //  this.connect.deletedAutomatic();
                  
                               
                  
                              //  // 
                              //    }
                                
                                    
                                  } else {

                                    this.propagar.emit({
                                      next: false,
                                      msg: 'No se logró consultar la actividad, inténtelo nuevamente' 
                                    })

                                  }
                  
                                 
                        
                            
                                 
                                 
                             
                                 
                                }
                              }
                            }).catch(async() => {
                              const msgg = await this.toas.create({
                                message: 'No se puede traer la informacion de la actividad',
                                duration: 3000
                              })
                  
                              await msgg.present();
                  
                  
                            })
                          })
                  
                       
                  
                         } else {

                          this.propagar.emit({
                            next: true,
                            msg: 'Bienvenido a camillería'
                          })

                         }
                  
                           } else {

                            this.propagar.emit({
                              next: true,
                              msg: 'Bienvenido a camillería'
                            })

                           }
                  
                        
                          
                  
                     
                        }, (err) => {

                          this.propagar.emit({
                            next: false,
                            msg: 'No se logró consultar la actividad, inténtelo nuevamente' 
                          })


                        })
        
                      } else if (res.LastEventID == '62') {

                        console.log('Holaa')
                        this.apiService.getMyActivities(login[0].AccessToken).subscribe((data: any) => {
   
                          console.log(data , 'GENERAL')
                       
                      
                  
                           if (data.length > 0) {
                            data = data.filter((it) => {
                              return it.CompanyStatusID == '23568' && it.AssignedToName == login[0].DisplayName;
                            })
                  
                  
                  
                         if (data.length > 0) {

                          let cont = data.length;

                          let myActivities = [];
                  
                  
                          data.forEach((item) => {
                            new Promise ((resolve, reject) => {
                                this.apiService.getActivitieInfo(login[0].AccessToken, item.GUID).subscribe((res) => {
                                  item.extras = res;
                                  item.extras.validate = false;
                  
                                 console.log('ZONAS', res)
                  
                                  if (login[0].WorkzoneID === '6842') {
                                    // console.log('SALIO')
                                    item.extras.zone = 'med';
                                    const prioridad = item.extras.Values.filter((it) => {
                                      return it.apiId.includes("PRIORIDAD");
                                    })
                  
                                    if (prioridad.length > 0) {
                                      item.extras.prioridad = prioridad[0].Value;
                  
                                    } else {
                                      item.extras.prioridad = 1000;
                  
                                    }
                  
                  
                                    console.log(prioridad, 'medellin')
                  
                  
                                  
                                  } else  if (login[0].WorkzoneID === '6993') {
                                    item.extras.zone = 'rng';
                                    const prioridad = item.extras.Values.filter((it) => {
                                      return it.apiId.includes("PRIORIDAD");
                                    })
                  
                  
                                    console.log(prioridad, 'medellin')
                  
                  
                  
                                    if (prioridad.length > 0) {
                                      item.extras.prioridad = prioridad[0].Value;
                  
                                    } else {
                                      item.extras.prioridad = 1000;
                  
                                    }
                  
                                  
                                  }
                                  resolve({work: login[0].WorkzoneID});
                                }, (err) => {
                                  reject(true);
                                })
                            }).then(async (rs: any) => {
                              if (rs) {
                                cont = cont - 1;
                  
                                if (cont === 0) {
                                  myActivities = data;
                                
                                  console.log(myActivities)
                  
                  
                                 

                                  if (myActivities.length > 0) {
                                      
                            //      const is =  await this.storage.insertActive([myActivities[0]]);
                  
                            //      if (is) {
                                 
                  
                            //       const myDate = myActivities[0].extras.Values.filter((y) => {
                            //         return y.apiId === 'FECHA'
                            //       })
                 
                            //       const hora = myActivities[0].extras.Values.filter((y) => {
                            //        return y.apiId === 'HORA'
                            //      })
                            //      console.log(myDate, hora, 'data de hora')
                 
                            //      let init;
                 
                            //      if (myDate.length > 0 && hora.length > 0) {
                            //        init = moment(myDate[0].Value + ' ' + hora[0].Value + ':00').format('YYYY-MM-DD HH:mm:ss');
                            //      } else {
                            //         init = moment(myActivities[0].extras.CreatedOn).format('YYYY-MM-DD HH:mm:ss');
                            //      }
                 
                            //      console.log(init, 'iniciado')
                                  
                            //        const end = moment().format('YYYY-MM-DD HH:mm:ss');
                            //        let diff = moment(end).diff(moment(init), 'seconds');
                 
                            //        console.log(diff, ' difff')
                 
                            //        if (diff < 0) {
                            //          diff = 0;
                            //        }
                            //       await this.storage.insertTimer(diff);
                 
                 
                            //      await this.storage.updateActiveForm({
                            //        api: 'FechaAsignacionCamillero',
                            //        value:  moment().format("YYYY-MM-DD HH:mm:ss")
                            //   })
                 
                            //   const msgg = await this.toas.create({
                            //    message: 'Solicitud Aceptada correctamente',
                            //    duration: 5000
                            //  })
                 
                   
                            //  await msgg.present();
                 
                 
                            //   await this.timerr.start_timer();
                            //   this.timerr.Active(true);
                  
                            //    myActivities = [];

                            //    this.router.navigate(['/tabs/tab2'])
                  
                            //    this.connect.deletedAutomatic();
                  
                               
                  
                            //    // 
                            //      }
                                
                                    
                                  } else {

                                    this.propagar.emit({
                                      next: false,
                                      msg: 'No existe se logró consultar la actividad, inténtelo nuevamente' 
                                    })

                                  }
                  
                                 
                        
                            
                                 
                                 
                             
                                 
                                }
                              }
                            }).catch(async() => {
                              const msgg = await this.toas.create({
                                message: 'No se puede traer la informacion de la actividad',
                                duration: 3000
                              })
                  
                              await msgg.present();
                  
                  
                            })
                          })
                  
                       
                  
                         } else {

                          this.propagar.emit({
                            next: true,
                            msg: 'Bienvenido a camillería'
                          })

                         }
                  
                           } else {

                            this.propagar.emit({
                              next: true,
                              msg: 'Bienvenido a camillería'
                            })

                           }
                  
                        
                          
                  
                     
                        }, (err) => {

                          this.propagar.emit({
                            next: false,
                            msg: 'No se logró consultar la actividad, inténtelo nuevamente' 
                          })


                        })
                      

                        */