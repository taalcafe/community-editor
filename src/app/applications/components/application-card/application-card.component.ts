import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.less']
})
export class ApplicationCardComponent implements OnInit {

  @Input() application: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToTranslationFiles() {
    this.router.navigate(['translation-files', this.application.id])
  }

}
