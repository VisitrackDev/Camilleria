import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-line',
  templateUrl: './text-line.component.html',
  styleUrls: ['./text-line.component.scss'],
})
export class TextLineComponent implements OnInit {
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

  constructor() { }

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


}
