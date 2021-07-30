import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell-phone',
  templateUrl: './cell-phone.component.html',
  styleUrls: ['./cell-phone.component.scss'],
})
export class CellPhoneComponent implements OnInit {
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
      this.pho = 'Escribe el número celular';
    }
  }

}
