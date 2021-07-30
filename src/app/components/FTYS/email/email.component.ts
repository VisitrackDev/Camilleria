import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
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
      this.pho = 'Escribe el correo Electrónicos';
    }
  }

}
