import { Component } from '@angular/core';
import {ConfigService} from '../services/config.service';
import {Config} from '../models/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public isConfigLoaded;

  private _config: Config;

  constructor(private configService: ConfigService) {
    configService.configSource.subscribe((config: Config) => {
      this._config = config;
      this.isConfigLoaded = true;
    });
    configService.getConfig();
  }

  loginByGoogle() {
    window.open(this._config.googleAuthUrl, '_self');
  }
}
