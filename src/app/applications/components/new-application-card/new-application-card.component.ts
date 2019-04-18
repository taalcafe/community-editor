import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-new-application-card',
  templateUrl: './new-application-card.component.html',
  styleUrls: ['./new-application-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewApplicationCardComponent implements OnInit, OnChanges {

  showModal: boolean = false;

  @Input() pending: boolean;
  @Input() success: boolean;
  @Input() error: string;

  @Output() ok: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['success'] !== "undefined") {
        let success = changes['success'].currentValue;
        if(success) this.handleCancel();
    }
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
