import { CONFIG_API } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
     providedIn: 'root'
})

export class UploadFileService {

     constructor(
          private http: HttpClient
     ) {

     }

     public upload(formData, company, type, parent) {
          const options: any = {
               headers: new HttpHeaders({
                    'x-company': company,
                    'x-type': type,
                    'x-parent': parent
               }),
               reportProgress: true,
               observe: 'events'
          };

          return this.http.post(`${CONFIG_API.URL_NODE}/folders`, formData, options);
     }
}
