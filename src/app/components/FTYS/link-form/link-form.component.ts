import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
})
export class LinkFormComponent implements OnInit {
  @Input() values;
  @Input() idActivity;
  constructor() { }

  ngOnInit() {}

}
