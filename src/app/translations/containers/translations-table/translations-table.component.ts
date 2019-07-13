import { Component, OnInit, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { Observable } from 'apollo-link';

@Component({
  selector: 'app-translations-table',
  templateUrl: './translations-table.component.html',
  styleUrls: ['./translations-table.component.less']
})
export class TranslationsTableComponent implements OnInit {

  @Input() translations: Translation[];

  editCache: { [key: string]: any } = {};

  startEdit(index: string): void {
    this.editCache[index].edit = true;
  }

  cancelEdit(index: string): void {
    this.editCache[index] = {
      data: { ...this.translations[index] },
      edit: false
    };
  }

  saveEdit(index: string): void {
    Object.assign(this.translations[index], this.editCache[index].data);
    this.editCache[index].edit = false;
  }

  updateEditCache(): void {
    this.translations.forEach((item, i) => {
      this.editCache[i] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {
    this.updateEditCache();
  }

  getSource(translations: Translation) {
    return translations.parts.map(_ => _.value).join('');
  }

}
