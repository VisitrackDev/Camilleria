import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-paragrahp',
  templateUrl: './paragrahp.component.html',
  styleUrls: ['./paragrahp.component.scss'],
})
export class ParagrahpComponent implements OnInit {
  @Input() txt;
  @Input() title;
  @Input() values;
  @Input() idActivity;
  constructor() { }

  ngOnInit() {}

}
