import {Component, OnInit} from '@angular/core';
import {SessionService} from './services/session.service';
import {ConfigAssetLoaderService} from './services/configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angulartest';

  constructor(
    private sessionService: SessionService,
    private configLoader: ConfigAssetLoaderService
  ) {
  }

  ngOnInit() {
    this.sessionService.startSession();
    this.loadSushiMenu();
    this.loadUserInfoMenu();
  }

  loadSushiMenu(): void {
    if (this.configLoader.configuration === undefined) {
      setTimeout(() => {
        this.loadSushiMenu();
      }, 500);
    } else {
      const scriptElement: HTMLScriptElement = document.createElement('script');
      scriptElement.src = this.configLoader.configuration.sushiMenuFrontendPath + 'sushi.js';
      scriptElement.type = 'text/javascript';
      document.getElementsByTagName('head')[0].append(scriptElement);
    }
  }

  loadUserInfoMenu(): void {
    if (this.configLoader.configuration === undefined) {
      setTimeout(() => {
        this.loadUserInfoMenu();
      }, 500);
    } else {
      const scriptElement: HTMLScriptElement = document.createElement('script');
      scriptElement.src = this.configLoader.configuration.userInfoMenuFrontendPath + 'user-info.js';
      scriptElement.type = 'text/javascript';
      document.getElementsByTagName('head')[0].append(scriptElement);
    }
  }

}
