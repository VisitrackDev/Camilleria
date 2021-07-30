import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.scss'],
})
export class HyperlinkComponent implements OnInit {
  @Input() lab;
  @Input() readonly;
  @Input() hel;
  @Input() required;
  @Input() val;
  @Input() values;
  @Input() idActivity;
  
  constructor() { }

  ngOnInit() {}

}
