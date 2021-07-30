import { NgModule } from '@angular/core';
import { FiltrosValuesPipe } from './filtros-values.pipe';
import { MotivoPipe } from './motivo.pipe';
import { SearchTextPipe } from './Search.pipe';
import { TimerPipe } from './timer.pipe';

@NgModule({
     declarations: [
          FiltrosValuesPipe,
          MotivoPipe,
          TimerPipe,
          SearchTextPipe
     ],
     imports: [

     ],
     exports: [
          FiltrosValuesPipe,
          MotivoPipe,
          TimerPipe,
          SearchTextPipe
     ]
})

export class PipesModule {

}
