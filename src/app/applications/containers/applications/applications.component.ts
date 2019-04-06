import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.less']
})
export class ApplicationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onBack() {
    alert('where do you think you\'re going? Back to work!')
  }

}
