import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';

@Injectable({
     providedIn: 'root'
})

export class NetworkService {

     private behaviourNetwork = new BehaviorSubject('wifi');
     public $getNetwork = this.behaviourNetwork.asObservable();

     constructor(
          private network: Network
     ) {

          this.listenRed();
          
      }


      listenRed() {
           this.network.onChange().subscribe((red) => {
                this.behaviourNetwork.next(red);
           })
      }

     
}
