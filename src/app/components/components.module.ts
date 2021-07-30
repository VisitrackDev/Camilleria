import { ListComponent } from './FTYS/list/list.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TitleComponent } from './FTYS/title/title.component';
import { TextLineComponent } from './FTYS/text-line/text-line.component';
import { DateComponent } from './FTYS/date/date.component';
import { TimeComponent } from './FTYS/time/time.component';
import { AddressComponent } from './FTYS/address/address.component';
import { CellPhoneComponent } from './FTYS/cell-phone/cell-phone.component';
import { EmailComponent } from './FTYS/email/email.component';
import { PhoneComponent } from './FTYS/phone/phone.component';
import { ParagrahpComponent } from './FTYS/paragrahp/paragrahp.component';
import { TextareaComponent } from './FTYS/textarea/textarea.component';
import { NumericValueComponent } from './FTYS/numeric-value/numeric-value.component';
import { RadioButtonsComponent } from './FTYS/radio-buttons/radio-buttons.component';
import { CheckboxComponent } from './FTYS/checkbox/checkbox.component';
import { DateTimeComponent } from './FTYS/date-time/date-time.component';
import { HyperlinkComponent } from './FTYS/hyperlink/hyperlink.component';
import { FormsComponent } from './FTYS/forms/forms.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../Pipes/pipes.module';
import { PictureComponent } from './FTYS/picture/picture.component';
import { MarcacionComponent } from './marcacion/marcacion.component';
import { TimerRealComponent } from './timer-real/timer-real.component';

@NgModule({
     declarations: [
          TitleComponent,
          TextLineComponent,
          DateComponent,
          TimeComponent,
          AddressComponent,
          CellPhoneComponent,
          EmailComponent,
          PhoneComponent,
          ParagrahpComponent,
          TextareaComponent,
          NumericValueComponent,
          RadioButtonsComponent,
          CheckboxComponent,
          DateTimeComponent,
          HyperlinkComponent,
          FormsComponent,
          FormsComponent,
          PictureComponent,
          ListComponent,
          MarcacionComponent,
          TimerRealComponent
     ],
     imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          PipesModule
     ],
     exports: [
          TitleComponent,
          TextLineComponent,
          DateComponent,
          TimeComponent,
          AddressComponent,
          CellPhoneComponent,
          EmailComponent,
          PhoneComponent,
          ParagrahpComponent,
          TextareaComponent,
          NumericValueComponent,
          RadioButtonsComponent,
          CheckboxComponent,
          DateTimeComponent,
          HyperlinkComponent,
          FormsComponent,
          FormsComponent,
          PictureComponent,
          ListComponent,
          MarcacionComponent,
          TimerRealComponent
     ]
})

export class ComponentsModule {

}

