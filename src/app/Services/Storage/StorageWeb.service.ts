import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment-timezone'
@Injectable({
     providedIn: 'root'
})

export class StorageWebService {

     constructor(
          private storage: Storage
     ) {

     }

     async insertUser(data: any) {
       return this.storage.get('login').then(async (dataLogin: any[]) => {
          dataLogin.push(data);
          await this.storage.set('login', dataLogin);
          console.log('Insertado!');
       }).catch((err) => {
            console.log('Error ', err);
       });
    }

    getToken() {
        return this.storage.get('login').then((dataLogin: any) => {
             return dataLogin[0].AccessToken;
        });
    }

    getComapny() {
          return this.storage.get('login').then((dataLogin: any) => {
               return dataLogin[0].CompanyID;
          });
      }
     
     async getFormActive() {
          return await this.storage.get('formActive');
     }

     async getForms() {
          return await this.storage.get('forms');
     }
     
     async getLogin() {
          return await this.storage.get('login');
     }

     async closeSession() {
          return await this.storage.set('login', []);
     }

     
    async insertActive(data) {
     return new Promise ((resolve, reject) => {
          this.storage.get('active').then(async (dataBD) => {


               let cont = data.length;
               data.forEach(element => {

                    const id = dataBD.filter((it) => {
                         return it.ID === element.ID
                    })

                //    console.log(id, 'evaluando', element);
          
                    if (id.length === 0) {
                         console.log('entrando a insertar')
                         dataBD.push(element);
                         this.storage.set('active', dataBD).then(() => {
                       
                              cont = cont - 1;
                         });
                      
                    } else {
                         cont = cont - 1;
                    }

                    if (cont === 0) {
                         resolve(true)
                    }
                    
               });

              
          }).catch((err) => {
               reject(err)
          })
     }) 
    }


    insertForms(data) {
     this.storage.get('forms').then(async (dataForm: any[]) => {
          if (dataForm.length > 0) {
               dataForm = [];
          }
          dataForm.push(data);
          await this.storage.set('forms', dataForm);
          console.log('Insertado!');
       }).catch((err) => {
            console.log('Error ', err);
       });
    }



    insertFormActive(data) {
     return this.storage.get('formActive').then(async (dataForm: any[]) => {
          if (dataForm.length > 0) {
               dataForm = [];
          }
          dataForm.push(data);
          console.log('Insertado el formulario activo!');
          return await this.storage.set('formActive', dataForm);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    insertID(data) {
     return this.storage.get('device').then(async (dataChat: any[]) => {
          dataChat = [];
          dataChat.push(data);
          return await this.storage.set('device', dataChat);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }


    insertChat(data) {
     return this.storage.get('chats').then(async (dataChat: any[]) => {
          dataChat = [];
          dataChat.push(data);
          console.log('Insertado en el chat!');
          return await this.storage.set('chats', dataChat);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    async getChat() {
     return await this.storage.get('chats');
    }


    insertPosition(data) {
     return this.storage.get('position').then(async (dataChat: any[]) => {
          dataChat = [];
          dataChat.push(data);
          console.log('Insertado position!');
          return await this.storage.set('position', dataChat);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    async getPosition() {
     return await this.storage.get('position');
    }



    insertEvent(data) {
     return this.storage.get('events').then(async (dataChat: any[]) => {
     
          return await this.storage.set('events', [data]);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    async getEvents() {
     return await this.storage.get('events');
    }


    insertForm(data) {
     return this.storage.get('form').then(async (dataChat: any[]) => {
          dataChat = [];
          dataChat.push(data);
          console.log('Insertado position!');
          return await this.storage.set('form', dataChat);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    updateForm(id) {
     return this.storage.get('active').then(async (dataBD: any[]) => {
          if (dataBD.length > 0) {
               console.log('Insertado position!', dataBD);

               dataBD.forEach((ele) => {
                    if (ele.ID === id) {
                         ele.extras.validate = true;
                    ele.extras.datevalid = moment().format("YYYY-MM-DD HH:mm:ss");
                    }
               })
            
               return await this.storage.set('active', dataBD);
          } else {
               return false;
          }
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }



    upt(id) {
     return this.storage.get('active').then(async (data: any[]) => {
          if (data.length > 0) {
           
              
               data.forEach((it) => {
                    if (it.ID === id) {
                          it.extras.validorigen = true;
                    }
               })
               return await this.storage.set('active', data);
          } else {
               return false;
          }
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }


    insertTimer(data) {
     return this.storage.get('timer').then(async (dataChat: any[]) => {
    
          return await this.storage.set('timer', data);
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

  


    updateTimer(time) {
     return this.storage.get('timer').then(async (dataChat) => {
          if (dataChat) {
               dataChat =  parseInt(dataChat) + parseInt(time);
               return await this.storage.set('timer', dataChat);
          } else {
               await this.storage.set('timer', time);
          }
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }


    DescUpdate() {
     return this.storage.get('desc').then(async (dataChat: any[]) => {
       
               return await this.storage.set('desc', [{descanso: moment().format('YYYY-MM-DD HH:mm')}]);
       
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }


    updateActiveForm(data) {
     return this.storage.get('active').then(async (dataBD: any[]) => {
          if (dataBD.length > 0) {

               console.log(dataBD)

               dataBD.forEach((dat) => {
                    if (dat.ID === data.id) {

                         const valid = dat.extras.Values.filter((it) => {
                              return it.apiId === data.api
                         })
          
                         if (valid.length > 0) {
                              dat.extras.Values.map((it) => {
                                   if (it.apiId === data.api) {
                                        it.Value = data.value
                                   }
                              })
                         } else {
                              dat.extras.Values.push({
                                   apiId: data.api,
                                   Value: data.value,
                                   ExternalID: null
                              })
                         }
                        

                    }
               })

               console.log(data, dataBD)
             
               return await this.storage.set('active', dataBD);
          } else {
               return false;
          }
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    async deleteDesc() {
     return await this.storage.set('desc', []);
    }

    async deleteEvents() {
     return await this.storage.set('events', []);
    }

    async deleteActive(id) {

     return this.storage.get('active').then(async (data: any[]) => {
          if (data.length > 0) {
           
              
            data = data.filter((it) => it.ID !== id)
            return await this.storage.set('active', data);
          } else {
               return false;
          }
         
       }).catch((err) => {
            console.log('Error ', err);
            return err;
       });
    }

    async deleteForm() {
     return await this.storage.set('form', []);
    }

    async deleteLogin() {
     return await this.storage.set('login', []);
    }


    async deletePosition() {
     return await this.storage.set('position', []);
    }


    async deleteTimer() {
     return await this.storage.set('time', []);
    }

    async deleteTimerData() {
     return await this.storage.set('timer', 0);
    }


    async getDesc() {
     return await this.storage.get('desc');
    }


    async getForm() {
     return await this.storage.get('form');
    }


    async getActive(id?) {

     if (id) {

          return new Promise((resolve, reject) => {
                this.storage.get('active').then((data) => {
                    const myActivity = data.filter((it) => it.ID === id);
                    resolve(myActivity)
                }).catch(() => {
                     reject(false)
                })
          }) 
     } else {

          return await this.storage.get('active');
     }
    }

    async getTimer() {
     return await this.storage.get('timer');
    }

    async getDevice() {
     return await this.storage.get('device');
    }

    async deleteDevice() {
     return await this.storage.set('device', []);
    }
    async deleteActiveAll() {
     return await this.storage.set('active', []);
    }

}

