import { Component, OnInit } from '@angular/core';
import { Apollo, Query, Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { R } from 'apollo-angular/types';
import { NzMessageService } from 'ng-zorro-antd';

const addApp: Query<any, R> = gql`
  mutation addApp($name: String!) {
    addApp(name: $name) {
      id,
      name,
      appKey,
      createdAt,
      updatedAt
    }
  }
`;

const apps: Query<any, R> = gql`
  query {
    apps {
      id,
      name,
      appKey,
      createdAt,
      updatedAt
    }
  }
`;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.less']
})
export class ApplicationsComponent implements OnInit {

  orgName: string = 'Leapest'
  apps: Observable<any[]>;

  addAppSuccess: boolean;
  addAppPending: boolean;
  addAppError: string;

  constructor(private apollo: Apollo, private message: NzMessageService) { }

  ngOnInit() {
    this.apps = this.apollo.watchQuery({
        query: apps,
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
    this.addAppPending = true;
    this.addAppSuccess = false;
    this.addAppError = undefined;

    this.apollo.mutate({
      mutation: addApp,
      variables: event,
      update: (proxy, { data: { addApp } }) => {
        try {
          const cache: any = proxy.readQuery({ query: apps });
          cache.apps.unshift(addApp);
          proxy.writeQuery({ query: apps, data: cache });
        }
        catch(error) {
          console.error(error);
        }
      }
    })
    .subscribe(
      _ => {
        this.message.success(`Successfully created new application ${event.name}`);
        this.addAppSuccess = true;
        this.addAppError = undefined;
      },
      error => {
        this.addAppSuccess = false;
        this.addAppError = error;
      },
      () => { this.addAppPending = false; }
    );
  }

}
