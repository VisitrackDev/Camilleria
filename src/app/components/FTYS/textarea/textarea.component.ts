import { Component, OnInit, Input } from '@angular/core';
import { StorageWebService } from 'src/app/Services/Storage/StorageWeb.service';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent implements OnInit {

  @Input() lab;
  @Input() required;
  @Input() hel;
  @Input() pho;
  @Input() readonly;
  @Input() id;
  @Input() values;
  @Input() api;
  @Input() idActivity;
  value = '';

  constructor(
    private storage: StorageWebService
  ) { }

  ngOnInit() {
    if (this.pho === '') {
      this.pho = 'Escriba aqui';
    }


    const value = this.values.filter((item) => {
      return item.apiId === this.api;
    })

    if (value.length > 0) {
      this.value =  value[0].Value
    }

    console.log(this.values, ' texto', this.api)
  }


  async setValue( event ) {
    const update = await this.storage.updateActiveForm({
      api: 'EQUIPO_MEDELLIN',
      value: event.detail.value,
      id: this.idActivity
    })

    if (update) {
      
    }
  }


}
