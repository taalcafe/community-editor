import { Component, OnInit } from '@angular/core';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  constructor(private configurations: ConfigurationsService) { }

  ngOnInit() {
  }

  goToGitHub() {
    window.open(this.configurations.gitHubUrl, '_blank');
  }

}
