import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'motivo'
})
export class MotivoPipe implements PipeTransform {

  transform(obj: any, color) {
   
   //  console.log(obj)

    if (color) {
          

      if (obj.prioridad === 1) {
        return 'rojo'
      } else if (obj.prioridad === 2) {
        return 'amarillo'
      } else if (obj.prioridad > 2 && obj.prioridad <= 5) {
        return 'gris'
      } else {
        return 'gris'
      }
  } else {

    const hospital  = obj.Values.filter((item) => {
      return item.apiId === "HOSPITAL"
    });

    if (hospital.length > 0) {

      let sede = hospital[0].Value.split(' ');
    //  console.log(sede)

      const filtro = obj.Values.filter((item) => {
        return item.apiId.includes(sede[sede.length - 1]);
      });

      if (filtro.length > 0) {

        let motivo = filtro.filter((item) => {
          return item.apiId.includes('MOTIVO');
        })[0].Value;

       return motivo;
       
      }
    } else {

      return '';
    
    }


  }

  }

}
