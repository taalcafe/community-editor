import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import ISO6391 from 'iso-639-1';

@Component({
  selector: 'app-missing-information-form',
  templateUrl: './missing-information-form.component.html',
  styleUrls: ['./missing-information-form.component.less']
})
export class MissingInformationFormComponent implements OnInit {

  @Input() sourceLanguage: string;
  @Input() targetLanguage: string;

  @Output() save: EventEmitter<any> = new EventEmitter();

  languages: string[];
  sourceLanguageLabel: string;

  constructor() { }

  ngOnInit() {
    this.languages = (<any>ISO6391).getAllCodes();
    this.sourceLanguageLabel = this.getLanguageLabel(this.sourceLanguage);
  }

  getLanguageLabel(code: string) {
    return (<any>ISO6391).getName(code)
  }

  onSave() {
    this.save.emit({
      sourceLanguage: this.sourceLanguage,
      targetLanguage: this.targetLanguage
    })
  }
}
