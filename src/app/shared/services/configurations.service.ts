import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  constructor() { }

  get gitHubUrl() {
    return 'https://github.com/taalcafe/community-editor';
  }
}
