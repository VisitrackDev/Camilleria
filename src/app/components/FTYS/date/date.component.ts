import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnInit {
  @Input() lab;
  @Input() readonly;
  @Input() hel;
  @Input() required;
  @Input() values;
  @Input() api;
  @Input() idActivity;

  myDate = new Date().toISOString();
  value = '';

  constructor() { }

  ngOnInit() {
   

    const value = this.values.filter((item) => {
      return item.apiId === this.api;
    })

    if (value.length > 0) {
      this.value =  value[0].Value
    }

    console.log(this.values, this.value, ' fechaaaaaaaaaaaaaaaa', this.api)
  }


}
