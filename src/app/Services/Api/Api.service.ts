
import { CONFIG_API } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { retryWhen, delayWhen, map } from 'rxjs/operators';
import { timer, Observable } from 'rxjs';
import * as moment from 'moment-timezone'
@Injectable({
     providedIn: 'root'
})


export class ApiService {
     constructor(
          private Http: HttpClient
     ) { }

     private HandlerError(error: Observable<any>) {
          let intentos = 0;
          return error.pipe(
               delayWhen(() => timer(5000)),
               map((errorResponse: HttpErrorResponse) => {
                              if (intentos === 3 ) {
                                   if (errorResponse instanceof ErrorEvent) {
                                        console.log('ErrorEvent');
                                        throw  new Error(' Conexion no establecida');
                                   } else if (errorResponse instanceof ProgressEvent) {
                                        console.log('ProgessEvent');
                                        throw new Error(' Conexion no establecida');
                                   } else {
                                        if (errorResponse.status === 404) {
                                             console.log('URL inv[erronea');
                                        }
                                        console.log('HttpError', errorResponse.error);
                                        throw new Error(' server ' + errorResponse.status);
                                   }
                              }

                              intentos++;
                         })
                    );
     }

     postLogin(login) {
          return this.Http.get(`${CONFIG_API.URL_API}Users/Auth?login=${login.user}&password=${login.password}&deviceid=${login.device}`).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     getForm(userVT, params: any) {
          console.log(userVT, 'servicio')
          // tslint:disable-next-line:max-line-length
          return this.Http.get(`${CONFIG_API.URL_CLUUD}Mobile/GetModuleInfo?tkn=${userVT.AccessToken}&key=FORMS&id=-1&f1=&f2=&f3=&lan=es`).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }

     getHelp(userVT: any) {
          return this.Http.get(`${CONFIG_API.URL_API}Help?tkn=${userVT.AccessToken}`).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     getUsersCompany(userVT: any) {
          return this.Http.get(`${CONFIG_API.URL_CLUUD}Users/GetModuleInfo?tkn=${userVT.AccessToken}&key=USERSCUSTOMS`).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     getActivities(tkn) {
          const date = moment().format("YYYY-MM-DD");
          console.log(date) 
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/Activities`, {
               AccessToken: tkn,
               From: date  + ' 00:00',
               To: date  + ' 23:59',
               FormGUID: 'e4qYnx7ONU',
               Search: 'SOLICITUD CON CAMILLERO',
               ByUser: true
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }



     getMyActivities(tkn) {
          const date = moment().format("YYYY-MM-DD");
          console.log(date)
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/DispatchesFromDateTime`, {
               AccessToken: tkn,
               FromDispatchDate: date  + ' 00:00',
               FormGUID: 'e4qYnx7ONU',
               Search: 'SOLICITUD CON CAMILLERO',
               ByUser: true
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }

     testerActivity(tkn, activity) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/CheckActivity`, {
               AccessToken: tkn,
               ActivityID: activity
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     getActivitieInfo(tkn, guid) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/Activity`, {
               AccessToken: tkn,
               GUID: guid,
               ListValues: false
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     aceptActivity(data) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/BasicDispatch`, data).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }



     dispacht(tkn, guid) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/Activity`, {
               AccessToken: tkn,
               GUID: guid,
               ListValues: false
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     rejectActivity(tkn, activity) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/RejectActivity`, {
               AccessToken: tkn,
               ActivityID: activity,
               ListValues: false
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }



     markPosition(tkn, tag) {
          return this.Http.post(`${CONFIG_API.URL_API}App/SearchTagUID`, {
               AccessToken: tkn,
               SearchtagUID: tag,
               TypeGUID: 'FAFC6342-BEF9-4E78-B65F-127AD101C107',
               Entity: 'Locations'
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     getForms(tkn, id) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/Forms`, {
               AccessToken: tkn,
               Search: id
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }

     eventRegister(tkn, data) {
          return this.Http.post(`${CONFIG_API.URL_API}Users/EventRegister`, {
               AccessToken: tkn,
               EventID: data.event,
               Entity: data.entity,
               EntityID: data.entityID,
               Latitude: data.lat,
               Longitude: data.lng
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }



     isDeleted(tkn, data) {
          return this.Http.post(`${CONFIG_API.URL_API}Surveys/ActivityStatus`, {
               AccessToken: tkn,
               ActivityID: data.ID,
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     upload(tkn, data) {
          return this.Http.post(`${CONFIG_API.URL_API}UploadBase64`, {
               AccessToken: tkn,
               BucketName: data.bucket,
               Base64Image: data.base,
               ExtensionFile: data.ext
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     userAditional(tkn, data) {
          return this.Http.post(`${CONFIG_API.URL_API}App/RequestEntity`, {
               AccessToken: tkn,
               Entity: '9',
               EntityValue: data.ID,
               Data: data.value,
               Priority: data.priority
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }

     reasigned(tkn, data) {
          return this.Http.post(`${CONFIG_API.URL_API}App/RequestEntity`, {
               AccessToken: tkn,
               Entity: '9',
               EntityValue: data.ID,
               Data: data.value,
               Priority: data.priority
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }



     getDeviceID(tkn) {
          return this.Http.post(`${CONFIG_API.URL_API}Users/DeviceID`, {
               AccessToken: tkn
          }).pipe(
               retryWhen(error => this.HandlerError(error))
          );
     }


     // e4qYnx7ONU



    

}
