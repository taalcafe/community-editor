import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.less']
})
export class TranslationsComponent implements OnInit {

  showComments: boolean;
  showNotes: boolean;

  comments = [
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: new Date()
    },
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: new Date()
    },
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: new Date()
    },
    {
      author: 'Han Solo',
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources' +
        '(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
      datetime: new Date()
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['translation-files', 1]);
  }

  openComments() {
    this.showComments = true;
  }

  openNotes() {
    this.showNotes = true;
  }

  closeComments() {
    this.showComments = false;
  }

  closeNotes() {
    this.showNotes = false;
  }

}
