import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.less']
})
export class TranslationsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['translation-files', 1]);
  }

}
