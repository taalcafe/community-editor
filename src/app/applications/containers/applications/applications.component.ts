import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.less']
})
export class ApplicationsComponent implements OnInit {

  orgName: string = 'Leapest'
  apps: Observable<any[]>

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apps = this.apollo.watchQuery({
        query: gql`
            query {
              apps {
                id,
                name,
                createdAt,
                updatedAt
              }
            }
      `,
    })
    .valueChanges
    .pipe(
      map(resp => resp.data['apps'])
    );
  }

  onBack() {
    alert('where do you think you\'re going? Back to work!')
  }

  onNewApplication(event: any) {
    debugger;
  }

}
