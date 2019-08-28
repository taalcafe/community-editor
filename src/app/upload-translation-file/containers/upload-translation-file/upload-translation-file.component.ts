import { Component, OnInit } from '@angular/core';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { TranslationMessagesFileFactory, FORMAT_XLIFF20, ITransUnit, FORMAT_XLIFF12 } from 'src/app/ngx-lib/api';
import { normalize } from '../../handler/normalizer';
import { Store } from '@ngxs/store';
import { LoadTranslations } from 'src/app/core/state/translations.state';
import { Translation } from '../../models/translation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-translation-file',
  templateUrl: './upload-translation-file.component.html',
  styleUrls: ['./upload-translation-file.component.less']
})
export class UploadTranslationFileComponent implements OnInit {

  uploading = false;
  showModal = false;

  translations: Translation[];
  fileName: string;
  content: any;
  sourceLanguage: string;
  targetLanguage: string;

  pending: boolean;
  state = 'Uploading';

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  beforeUpload = (event: any) => {
    this.pending = true
  }

  handleChange({ file }: { [key: string]: any }): void {
    if (file.status === 'uploading')  this.uploading = true;
    else if(file.status === 'done' || file.status === 'error') this.uploading = false;
  }

  process = (item: UploadXHRArgs) => {

    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.state = 'Processing';

      console.log(fileReader.result);

      const factory = new TranslationMessagesFileFactory();
      const content = <string>fileReader.result;

      const file = factory.createFileFromFileContent(
        FORMAT_XLIFF12,
        content,
        item.file.name,
        'utf8'
      );

      const transUnits: ITransUnit[] = [];
      file.forEachTransUnit(tu => transUnits.push(tu));

      this.translations = normalize(transUnits);
      this.fileName = item.file.name;
      this.content = content;
      this.sourceLanguage = file.sourceLanguage();
      this.targetLanguage = file.targetLanguage();
      
      this.state = 'Completed';

      if (this.targetLanguage) return this.loadTranslations();

      this.showModal = true;
    }

    fileReader.readAsText(<any>item.file);
  };

  loadTranslations() {
    this.store.dispatch(new LoadTranslations(
        this.translations,
        this.fileName,
        this.content,
        this.sourceLanguage,
        this.targetLanguage
    ))
    this.router.navigate(['translations'])
  }

  onSaveMissingInformation(event: any) {
    this.targetLanguage = event.targetLanguage;

    this.loadTranslations();
  }
}
