import { Pipe, PipeTransform } from '@angular/core';
import { StorageWebService } from '../Services/Storage/StorageWeb.service';
@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  constructor(
    private storage: StorageWebService
  ) {

  }

  transform(val: any, type, valu) {
   
  //  console.log(val)

    if (type === 'hours') {

      if (Math.floor((val / 60)) >= 60) {
         return Math.floor(((val / 60) / 60))
      } else {
        return '00';
      }
    } else  if (type === 'minutes') {

      if (Math.floor((val / 60)) >= 60) {

        const minutos = Math.floor((val / 60) / 60) * 60; 
        const segundos = minutos * 60;
        const final = val - segundos;
        return Math.floor(((final / 60)))

     } else {
      return Math.floor(((val / 60)))
     }
  } else if (type === 'second') {
        let current = Math.floor((val / 60)) * 60;

        return val - current;

    } else if (type === 'color') {

    
            let temp  = valu - 2;

            if (Math.floor((val / 60)) >= temp && Math.floor((val / 60)) < valu) {
              return 'ama'
            } else if (Math.floor((val / 60)) >= valu) {
                return 'rojo'
            } 
       
    }



  }

}
