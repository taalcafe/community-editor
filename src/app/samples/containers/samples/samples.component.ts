import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.less']
})
export class SamplesComponent implements OnInit {

  logo: string;
  minutes: number;
  gender: string;

  placeholder1: string;
  placeholder2: string;
  
  constructor() { }

  ngOnInit() {
  }

}
