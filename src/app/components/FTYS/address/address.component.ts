import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
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
      this.pho = 'Escribe la dirección';
    }
  }

}
