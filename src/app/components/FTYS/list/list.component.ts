import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
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

    if (value.length > 0) {
      console.log(value[0].Value, 'jujfdgfdgdfgu')
      this.value = value[0].Value;
    }

    console.log(this.values, ' texto', this.api)
  }

}
