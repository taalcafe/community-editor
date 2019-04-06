import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.less']
})
export class ApplicationCardComponent implements OnInit {

  @Input() application: any;

  constructor() { }

  ngOnInit() {
  }

}
