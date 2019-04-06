import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.less']
})
export class ApplicationsComponent implements OnInit {

  orgName: string = 'Leapest'
  applications: any[] = [
    { name: 'Instructor Marketplace', updatedAt: '2019-04-06T22:36:40.937Z'},
    { name: 'Product Marketplace', updatedAt: '2019-04-04T20:15:43.937Z'},
    { name: 'Branded Portal', updatedAt: '2019-04-01T17:10:40.937Z'},
    { name: 'Sahara', updatedAt: '2019-03-28T14:00:40.937Z'}
  ]

  constructor() { }

  ngOnInit() {
  }

  onBack() {
    alert('where do you think you\'re going? Back to work!')
  }

}
