import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit {
  @Input() lab;
  @Input() readonly;
  @Input() hel;
  @Input() required;
  @Input() values;
  @Input() api;
  @Input() idActivity;
  
  value = '';

  constructor() { }

  ngOnInit() {
   

    const value = this.values.filter((item) => {
      return item.apiId === this.api;
    })

    if (value.length > 0) {
      this.value =  value[0].Value
    }

    console.log(this.values, this.value, ' Horaaaaaaa', this.api)
  }


}

