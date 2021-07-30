import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {

  @Input() lab;
  @Input() required;
  @Input() hel;
  @Input() readonly;
  @Input() opts;
  @Input() values;
  @Input() api;
  @Input() idActivity;

value = '';

constructor() { }

ngOnInit() {
  console.log(this.opts, typeof this.opts);

  const value = this.values.filter((item) => {
    return item.apiId === this.api;
  })

  console.log(value[0].Value, 'check')

  let arreglo = [];

  if (value.length > 0) {

    const arr = value[0].Value.split(',');

    arr.forEach((item) => {

      const valid = this.opts.filter((it) =>  it.txt === item)
      if (valid.length > 0) {
          valid[0].checked = true;
          arreglo.push(valid[0]);
      }
    })

    console.log(arreglo, 'arreg')

    if (arreglo.length > 0) {
      this.opts = arreglo;
    }

  }

  console.log(this.values, ' texto', this.api)
}

}
