import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrosValues'
})
export class FiltrosValuesPipe implements PipeTransform {

  transform(value: any[], api) {
    const val =  value.filter((item) => {
      return item.apiId === api
    })

 //   console.log(val, value, api)

    if (val.length > 0) {
      return val[0].Value ;
    } else {
      return '';
    }

    
  }

}
