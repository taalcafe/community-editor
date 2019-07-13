import { Component, OnInit } from '@angular/core';
import { UploadXHRArgs } from 'ng-zorro-antd';
import { TranslationMessagesFileFactory, FORMAT_XLIFF20, ITransUnit } from 'src/app/ngx-lib/api';
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

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  handleChange({ file, fileList }: { [key: string]: any }): void {
    if (file.status === 'uploading')  this.uploading = true;
    else if(file.status === 'done' || file.status === 'error') this.uploading = false;
  }

  process = (item: UploadXHRArgs) => {

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);

      const factory = new TranslationMessagesFileFactory();

      const file = factory.createFileFromFileContent(
        FORMAT_XLIFF20,
        <string>fileReader.result,
        item.file.name,
        'utf8'
      );
      
      const transUnits: ITransUnit[] = [];
      file.forEachTransUnit(tu => transUnits.push(tu));


      const translations: Translation[] = normalize(transUnits);
      this.store.dispatch(new LoadTranslations(translations, item.file.name))
      this.router.navigate(['translations'])
    }

    fileReader.readAsText(<any>item.file);
  };
}
