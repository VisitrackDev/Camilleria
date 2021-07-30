import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
})
export class DateTimeComponent implements OnInit {
  @Input() lab;
  @Input() readonly;
  @Input() hel;
  @Input() required;
  @Input() values;
  @Input() hid;
  @Input() idActivity;
  myDate = new Date().toISOString();
  constructor() { }

  ngOnInit() {

    this.hid = true;
  }

}
