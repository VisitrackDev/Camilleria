import { Router } from '@angular/router';
import { ActionSheetController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { StorageWebService } from './../Services/Storage/StorageWeb.service';
import { ApiService } from './../Services/Api/Api.service';
import { Component } from '@angular/core';
import { TimerService } from '../Services/Utilities/Timer.service';

import * as moment from 'moment-timezone'
import { ConnectService } from '../Services/Utilities/Connect.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  activitiesList = [];

  load = false;
  img = '';

  active = false;
  timer = false;

  tim = true;
  stop = false;

  interval;
  text = '';

  constructor(
    private apiService: ApiService,
    private storage: StorageWebService,
    private toas: ToastController,
    private actionSheet: ActionSheetController,
    private loading: LoadingController,
    private router: Router,
    private timerr: TimerService,
    private connect: ConnectService,
    private nav: NavController
  ) {

    this.connect.$delete.subscribe((tm) => {
      if (tm) {
       
        this.activitiesList = this.activitiesList.filter((it) => it.ID !== tm)
        
      }
    })


    setTimeout(async () => {

    
      const events = await this.storage.getEvents();
      if (events) {
        if (events.length > 0) {
            // console.log('descanso1')
        } else {

      const active = await this.storage.getActive();

      if (active) {
  
        if (active.length > 0) {


          this.activities()
        // // console.log('ACTIVATE')
        } else {
          this.load = false;

          this.activities()
 
          // console.log('Ejecutando')

          // // console.log('HAIENDO')
        }

      }

    }
  }
    }, 0)

   this.interval =  setInterval(async () => {

 
      // console.log('EJECUTANDO SET PRIMERO')
     const events = await this.storage.getEvents();
     if (events) {
       if (events.length > 0) {
        // console.log('descanso2')
       } else {
        const active = await this.storage.getActive();

        if (active) {
    
      
  
         
            this.load = false;

            const login = await this.storage.getLogin();
  
            if (login) {
              if (login.length > 0) {
                if (!this.stop) {
                   // console.log('EJECUTAR SET INTERVAL')
                  this.activities()
                 
                }
              } else {
                clearInterval(this.interval)
              }
            }
          
  
        }
        
       }
     }

    }, 30000)

  }


  // 59 origen, 58 destino
  

  ionViewWillEnter() {

    this.activitiesList = [];

    this.activities();

   
  }




  doRefresh( event ) {
    this.load = false;
    this.activitiesList = [];
   this.activities().then(() => {
    event.target.complete();
   }).catch(() => {
    event.target.complete();
   })
  }


  changeText(event) {
    this.text = event.detail.value;
    console.log(this.text)
  }


  async activities() {

    const login = await this.storage.getLogin();

    if (login) {

      this.img = login[0].logo;

      const myActivities = await this.storage.getActive();

      if (myActivities) {
        if (myActivities.length > 0) {

         this.activitiesList = myActivities;
         const idsActivities = myActivities.map((it) => it.ID);

         this.loadlIstActivities(login, idsActivities);
        } else {

         this.loadlIstActivities(login, []);

        }
      }
      // // // // console.log(login)
     
    }
    
  }


  loadlIstActivities(login, listActivities) {
    this.apiService.getMyActivities(login[0].AccessToken).subscribe((data: any) => {
   
          console.log(data , 'GENERAL')

       data = data.filter((it) => {
        return it.CompanyStatusID == '23568' && it.AssignedToName == login[0].DisplayName;
      })



       if (data.length > 0) {
      

        console.log(data, 'DATAAA')


     if (data.length > 0) {

      let validActivities = false;


      if (listActivities.length > 0) {

        let temp = data;
     
        listActivities.forEach((it) => {
          temp.forEach(element => {
            if (it === element.ID) {
              data = data.filter(function(dat) {

               return dat.ID !== it

              })
            }
          });
        })
       
        validActivities = true;
       // console.log(data, 'DATA CON CONDICION', listActivities)
      } 
     // console.log(data, 'GENERALL')
      let cont = data.length;

      if (cont > 0) {

      data.forEach((item) => {
        new Promise ((resolve, reject) => {
            this.apiService.getActivitieInfo(login[0].AccessToken, item.GUID).subscribe((res) => {
              item.extras = res;
              item.extras.validate = false;

             // console.log('ZONAS', res)

              if (login[0].WorkzoneID === '6842') {
                // // console.log('SALIO')
                item.extras.zone = 'med';
                const prioridad = item.extras.Values.filter((it) => {
                  return it.apiId.includes("PRIORIDAD");
                })

                if (prioridad.length > 0) {
                  item.extras.prioridad = prioridad[0].Value;

                } else {
                  item.extras.prioridad = 1000;

                }


                // console.log(prioridad, 'medellin')


              
              } else  if (login[0].WorkzoneID === '6993') {
                item.extras.zone = 'rng';
                const prioridad = item.extras.Values.filter((it) => {
                  return it.apiId.includes("PRIORIDAD");
                })


                // console.log(prioridad, 'medellin')



                if (prioridad.length > 0) {
                  item.extras.prioridad = prioridad[0].Value;

                } else {
                  item.extras.prioridad = 1000;

                }

              
              }
              resolve(item);
            }, (err) => {
              reject(true);
            })
        }).then(async (rs: any) => {
          if (rs) {
            cont = cont - 1;

          // console.log(rs, 'holaaaa')

            if (cont === 0) {
          
              if ( validActivities ) {
                data.forEach(element => {
                 const id = this.activitiesList.filter((ele) => {
                   return ele.ID === element.ID;
                 })

                 if (id.length === 0) {
                  this.activitiesList.push(element);
                 }
                });
              } else {
                this.activitiesList = data;
              }
              this.activitiesList = this.activitiesList.sort((a, b) => {
                if (a.extras.prioridad < b.extras.prioridad) {
                  return -1;
                }

                if (a.extras.prioridad > b.extras.prioridad) {
                  return 1;
                }

                return 0;
              })

              // console.log(this.activitiesList, 'ultima')


              // this.activitiesList = this.activitiesList.filter((tr) => {
              //   let destiny = tr.extras.Values.filter(u => {
              //     return u.apiId.includes('FechaLlegadaDestino')
              //   })

              //   // console.log('destiny', destiny)

              //   if (destiny.length > 0) {

              //     if (destiny[0].Value === '') {
              //       return tr;
              //     }
                 
              //   } else {
              //     return tr;
              //   }
                
              // })

              const events = await this.storage.getEvents();

              if (events) {
                if (events.length > 0) {

                  // var torre =  this.activitiesList[0].extras.Values.filter((it) => {
                  //   return it.apiId.includes('TORREPISO_ORG')
                  // })
      
                  // var prioridad =  this.activitiesList[0].extras.Values.filter((it) => {
                  //   return it.apiId.includes('PRIORIDAD')
                  // })
      
                  // var priori = 1;
      
                  // if (prioridad.length > 0) {
                  //     priori = parseFloat(prioridad[0].Value)
                  // }
      
      
                  // this.apiService.reasigned(login[0].AccessToken, {ID:  this.activitiesList[0].extras.ID,  value: '1|' + torre[0].Value + '|web',  priority: priori} ).subscribe(async (r: any) => {
            
                  // }, async (err) => {
                 
            
                  //   const msgg = await this.toas.create({
                  //     message: 'No se pudo reasignar el servicio en segundo plano, comuniquese con la central para reasignarlo',
                  //     duration: 5000
                  //   })
            
                  //   await msgg.present();
                  // })
      

                } else {
  
               
                 await this.storage.insertActive(this.activitiesList)


            //  if (is) {
          //      const myDate = this.activitiesList[0].extras.Values.filter((y) => {
          //        return y.apiId === 'FECHA'
          //      })

          //      const hora = this.activitiesList[0].extras.Values.filter((y) => {
          //       return y.apiId === 'HORA'
          //     })
          //     // console.log(myDate, hora, 'data de hora')

          //     let init;

          //     if (myDate.length > 0 && hora.length > 0) {
          //       init = moment(myDate[0].Value + ' ' + hora[0].Value + ':00').format('YYYY-MM-DD HH:mm:ss');
          //     } else {
          //        init = moment(this.activitiesList[0].extras.CreatedOn).format('YYYY-MM-DD HH:mm:ss');
          //     }

          //     // console.log(init, 'iniciado')
               
          //       const end = moment().format('YYYY-MM-DD HH:mm:ss');
          //       let diff = moment(end).diff(moment(init), 'seconds');

          //       // console.log(diff, ' difff')

          //       if (diff < 0) {
          //         diff = 0;
          //       }
          //      await this.storage.insertTimer(diff);


          //     await this.storage.updateActiveForm({
          //       api: 'FechaAsignacionCamillero',
          //       value:  moment().format("YYYY-MM-DD HH:mm:ss")
          //  })

           const msgg = await this.toas.create({
            message:  data.length  + ' solicitudes sincronizadas en el dispositivo',
            duration: 5000
          })

          // this.activitiesList.splice(0, 1);

          await msgg.present();



        //   this.active = true;
          //  await this.timerr.start_timer();
          //  this.timerr.Active(true);
       
         //  this.router.navigate(['/tabs/tab2'])

          //  this.activitiesList = [];

          //  this.stop = false;
          //  this.connect.deletedAutomatic();


        //    this.apiService.eventRegister(login[0].AccessToken, {
        //     event: 66,
        //     lat: 0,
        //     lng: 0,
        //     entity: '10',
        //     entityID: login[0].UserID
        // }).subscribe(async (rs: any) => {
      
        //   if (rs.Status == 'OK') {
      
         
          
        //       } else {
          
              
        //     this.msgError('No se proceso el evento 66');
        //       }
          
            
          
        //   }, async (err) => {
        //     //  this.changeStatus(false);
        //     this.msgError('No se proceso el evento 66');
            
        //   })

           

           // 
         //    }
            
                }
              }
            
        
             
             
         
             
             
              // // // console.log(this.activitiesList, 'ACTIVITIES')
              this.load = true;
            }
          }
        }).catch(async() => {
          this.load = true;
          const msgg = await this.toas.create({
            message: 'No se puede traer la informacion de la actividad',
            duration: 3000
          })

          await msgg.present();


        })
      })

    } else {
      this.load = true;
    }

     } else {
      this.load = true;
     }

       } else {
         this.load = true;
       }

    
      

 
    }, (err) => {
      this.load = true;
       // // // // console.log(err)
    })
  }

  async changeStatus(data, i) {
    this.router.navigate(['/tabs/tab2', data.ID])
  }

  async rejectActivity(activity, i) {

    const info = await this.storage.getLogin();

    if (info) {
      this.apiService.rejectActivity(info[0].AccessToken, activity.ID).subscribe(async (res: any) => {
        // // // // console.log(res, activity)
        if (res.length > 0) {
          if (res[0].Status === 'Error') {

            const msgg = await this.toas.create({
              message: 'Error ' + res[0].Message,
              duration: 5000
            })
  
            await msgg.present();
  
          } else {

            this.activitiesList.splice(i, 1)

            
            const msgg = await this.toas.create({
              message: 'Actividad rechazada',
              duration: 5000
            })
  
            await msgg.present();
  
  
          }
        } else {
          const msgg = await this.toas.create({
            message: 'Error no se puede acceder al servicio',
            duration: 5000
          })

          await msgg.present();
        }
       
      })
    }

  }


  async aceptActivity(activity, i) {

    const loading = await this.loading.create({
      message: 'Aceptando actividad, por favor espere',
    })

    await loading.present();

    // // // // console.log(activity)

    const info = await this.storage.getLogin();

    if (info) {
      this.apiService.testerActivity(info[0].AccessToken, activity.extras.ID).subscribe(async (res: any) => {
        // // // // console.log(res);

        if (res.length > 0) {

            if (res[0].CompanyStatusName.includes("SOLICITUD CON CAMILLERO")) {
              this.activitiesList.splice(i, 1)
              const msgg = await this.toas.create({
                message: 'Esta solicitud ya la tiene un camillero',
                duration: 5000
              })
    
              await msgg.present();
              await loading.dismiss();
            } else {
  
              this.apiService.aceptActivity({
                AccessToken: info[0].AccessToken,
                FormGUID: activity.extras.FormGUID,
                LocationGUID: activity.extras.LocationGUID,
                AssetGUID: activity.extras.AssetGUID,
                UserGUID: info[0].GUID,
                Duration: "60",
                Values: JSON.stringify(activity.extras.Values),
                ActivityGUID: activity.extras.GUID
              }).subscribe(async (dat: any) => {
                 // // // console.log(dat, activity)
                 
                if (dat.Status === 'OK') {
                  this.activitiesList.splice(i, 1);
                  activity.extras.CompanyStatusName = 'SOLICITUD CON CAMILLERO'
                  await loading.dismiss();
              //    const is =  await this.storage.insertActive([activity]);

              //    if (is) {
              //     await this.storage.updateActiveForm({
              //       api: 'FechaAsignacionCamillero',
              //       value:  moment().format("YYYY-MM-DD HH:mm:ss")
              //  })
              //    }
                  const msgg = await this.toas.create({
                    message: 'Solicitud Aceptada correctamente',
                    duration: 5000
                  })
        
                  await msgg.present();
                  this.active = true;
                  this.router.navigate(['/tabs/tab2'])

                  
                 
                 
                } else {
        
                  const msgg = await this.toas.create({
                    message: 'Error ' + dat.Message,
                    duration: 5000
                  })
        
                  await msgg.present();
        
                }
        
             })
  
            }
  
         
        } else {
          const msgg = await this.toas.create({
            message: 'No se obtuvo respuesta',
            duration: 5000
          })

          await msgg.present();
          await loading.dismiss();
        }

       


      }, async (err) => {
        await loading.dismiss();
      })
      // this.apiService.aceptActivity({
      //   AccessToken: info[0].AccessToken,
      //   FormGUID: activity.extras.FormGUID,
      //   LocationGUID: activity.extras.LocationGUID,
      //   AssetGUID: activity.extras.AssetGUID,
      //   UserGUID: info[0].GUID,
      //   Duration: "60",
      //   Values: JSON.stringify(activity.extras.Values),
      //   ActivityGUID: activity.extras.GUID,
      //   CompanyStatusGUID: '789AD011-C4B1-4A2F-A748-74B9B8904E7C'
      // }).subscribe(async (res: any) => {
      //   // // // // console.log(res, activity)
         
      //   if (res.Status === 'OK') {
      //     this.activitiesList.splice(i, 1);
      //     const msgg = await this.toas.create({
      //       message: 'Solicitud Aceptada correctamente',
      //       duration: 5000
      //     })

      //     await msgg.present();
         
      //   } else {

      //     const msgg = await this.toas.create({
      //       message: 'Error ' + res[0].Message,
      //       duration: 5000
      //     })

      //     await msgg.present();

      //   }

      //   await loading.dismiss();
       
      // })
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
