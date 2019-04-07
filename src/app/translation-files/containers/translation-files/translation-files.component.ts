import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-translation-files',
  templateUrl: './translation-files.component.html',
  styleUrls: ['./translation-files.component.less']
})
export class TranslationFilesComponent implements OnInit {

  translationFile: any = { id: '2' };
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];

  count = 5;
  fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';


  constructor(private router: Router, private http: HttpClient, private msg: NzMessageService) { }


  ngOnInit(): void {
    this.getData((res: any) => {
      this.data = res.results.map((_, i) => { _.index = i; return _});;
      this.list = res.results.map((_, i) => { _.index = i; return _});;
      this.initLoading = false;
    });
  }

  getData(callback: (res: any) => void): void {
    this.http.get(this.fakeDataUrl).subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.list = this.data.concat([...Array(this.count)].fill({}).map(() => ({ loading: true, name: {} })));
    this.http.get(this.fakeDataUrl).subscribe((res: any) => {
      this.data = this.data.concat(res.results).map((_, i) => { _.index = i; return _});
      this.list = [...this.data];
      this.loadingMore = false;
    });
  }

  edit(): void {
    // this.msg.success(item.email);
    this.router.navigate(['translations', this.translationFile.id]);
  }

  onBack() {
    this.router.navigate(['applications']);
  }

}
