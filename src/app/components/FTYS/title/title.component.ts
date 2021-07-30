import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
  
  @Input() title;
  @Input() values;
  @Input() idActivity;

@Input() fie;
  constructor() {
    console.log(this.fie, 'titulo')
   }

  ngOnInit() {}

}
