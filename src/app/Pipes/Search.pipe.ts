import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchtext'
})
export class SearchTextPipe implements PipeTransform {

  transform(value: any[], text) {

    text = text.toLowerCase()
   

   console.log(text, value)

   if (text === '') {
       return value;
   } else {
    return value.filter((item) => {
        let o = item.extras.Values.filter((it) => {
            let val = it.Value.toLowerCase();
            return val.includes(text)
        })

        console.log(o, ' todo')

        return o;
      })
   }


    
  }

}
