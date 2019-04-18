import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-application-form',
  templateUrl: './new-application-form.component.html',
  styleUrls: ['./new-application-form.component.less']
})
export class NewApplicationFormComponent implements OnInit {

  @Input() pending: boolean;
  @Input() error: string;

  @Output() ok: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
    
  form = this.fb.group({
    name: [null, [Validators.required]]
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  submitForm(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if(this.form.valid) this.ok.emit(this.form.value);
  }

  onCancel() {
    this.cancel.emit();
  }

}
