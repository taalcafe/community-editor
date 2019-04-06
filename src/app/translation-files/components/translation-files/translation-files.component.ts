import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translation-files',
  templateUrl: './translation-files.component.html',
  styleUrls: ['./translation-files.component.less']
})
export class TranslationFilesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['applications']);
  }

}
