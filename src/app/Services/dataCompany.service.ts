// ESTE SERVICIO SE USA PARA TRAER EL LOGO Y NOMBRE UNA VEZ INICIA SESSION Y RENDERIZARLO EN EL MENU

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageWebService } from './Storage/StorageWeb.service';
import { ToastService } from './Utilities/Toast.service';
import { Router } from '@angular/router';

@Injectable({
     providedIn: 'root'
})

export class DataComparnyService {

     private data = new BehaviorSubject({});
     public dataCompany = this.data.asObservable();

     private color = new BehaviorSubject('light');
     public $color = this.color.asObservable();

     private view = new BehaviorSubject('1');
     public $view = this.view.asObservable();

     private users = new BehaviorSubject({});
     public $users = this.users.asObservable();

     private notification = new BehaviorSubject('');
     public $notification = this.users.asObservable();


     constructor(
          private storage: StorageWebService,
          private myToast: ToastService,
          private router: Router,
          private toasCtrl: ToastService
     ) { 
        
     
     }

     getDataCompany(data) {
          this.data.next(data);
     }

     setColor(data) {
          this.color.next(data);
     }

     getVista(view) {
          this.view.next(view);
     }
     // setUser(user) {
     //      this.users.next(user);
     // }

     // getUsersChat() {
     //      this.storage.getComapny().then((company) => {
     //           const info: any = {
     //                company
     //           };
     //           this.socket.emit('users', info);
     //           this.socket.on('usersall', (data) => {
     //                this.gets.next(data)
     //           });
     //      });
     // }

     // getViewChat(user) {
     //      this.chat.next(user);
     // }

    
}
