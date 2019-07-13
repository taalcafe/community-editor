import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Translation } from 'src/app/upload-translation-file/models/translation';
import { Observable } from 'apollo-link';
import { Select, Store } from '@ngxs/store';
import { UpdateTranslation } from 'src/app/core/state/translations.state';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.less']
})
export class TranslationsComponent implements OnInit {

  @Select(state => state.translations.translations)
  translations$: Observable<Translation[]>;

  showComments: boolean;
  showNotes: boolean;
  view: string = 'table';

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

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate(['']);
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

  saveTranslation({index, target}) {
    this.store.dispatch(new UpdateTranslation(index, target));
  }

}
