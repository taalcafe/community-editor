import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-application-card',
  templateUrl: './new-application-card.component.html',
  styleUrls: ['./new-application-card.component.less']
})
export class NewApplicationCardComponent implements OnInit {

  showModal: boolean = false;
  ok: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openModal() {
    this.showModal = true;
  }

  handleOk(event: any) {
    this.ok.emit(event);
  }

  handleCancel() {
    this.showModal = false;
  }

}
