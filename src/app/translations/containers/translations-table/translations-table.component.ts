import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-translations-table',
  templateUrl: './translations-table.component.html',
  styleUrls: ['./translations-table.component.less']
})
export class TranslationsTableComponent implements OnInit {

  editCache: { [key: string]: any } = {};
  listOfData: any[] = [];

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  ngOnInit(): void {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        id: `${i}`,
        key: `Edrward ${i}`,
        meaning: `Meaning ${i}`,
        description: `Description ${i}`,
        default: `Default text ${i}`,
        translation: `Translation ${i}`
      });
    }
    this.updateEditCache();
  }

}
