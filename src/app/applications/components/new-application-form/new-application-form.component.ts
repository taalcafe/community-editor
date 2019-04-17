import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-application-form',
  templateUrl: './new-application-form.component.html',
  styleUrls: ['./new-application-form.component.less']
})
export class NewApplicationFormComponent implements OnInit {

  form = this.fb.group({
    name: [null, [Validators.required]]
  });

  ok: EventEmitter<any> = new EventEmitter();
  cancel: EventEmitter<void> = new EventEmitter();

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
