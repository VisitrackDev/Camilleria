import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss'],
})
export class PhoneComponent implements OnInit {
  @Input() lab;
  @Input() required;
  @Input() hel;
  @Input() pho;
  @Input() readonly;
  @Input() values;
  @Input() idActivity;
  constructor() { }

  ngOnInit() {
    if (this.pho === '') {
      this.pho = 'Escribe el número de teléfono';
    }
  }

}
