import { Injectable } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AppSettingService {
  configData: any = {};
  baseURLs: any = {};

  RequestId: string;
  CorrelationId: string;

  constructor(private config: AppConfigService) {
    this.configData = config.config;
    this.baseURLs = this.configData.apiBaseUrl;
  }

  generateUUID(): string {
    return crypto.randomUUID();
  }
}
