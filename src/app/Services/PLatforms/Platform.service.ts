import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
     providedIn: 'root'
})

export class PlatformsService {

     private platformBehaviour = new BehaviorSubject('');
     $myplatform = this.platformBehaviour.asObservable();

     constructor() {

     }

     changePlatform(plt: any) {
          return this.platformBehaviour.next(plt);
     }

     stopPlatform() {
     }
}
