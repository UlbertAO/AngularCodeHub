import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  public static readonly configPath = 'config/config.json';

  public config: Record<string, unknown>;
  constructor(private http: HttpClient) {
    this.config = {};
  }

  /**
   * Use to get the data found in the second file (config file)
   */

  public getConfig(): object {
    return this.config;
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   *  for more https://juristr.com/blog/2018/01/ng-app-runtime-config/
   */
  public load(): Promise<boolean> {
    return new Promise((resolve) => {
      if (sessionStorage[AppConfigService.configPath]) {
        try {
          this.config = JSON.parse(
            sessionStorage[AppConfigService.configPath]
          ) as Record<string, unknown>;
          resolve(true);
          return;
        } catch (error) {
          // problem processing this - refresh the data
        }
      }
      this.http
        .get(AppConfigService.configPath)
        .pipe(
          take(1),
          catchError((err) => throwError(err || 'Server error'))
        )
        .subscribe((configResponse: object) => {
          sessionStorage[AppConfigService.configPath] =
            JSON.stringify(configResponse);
          this.config = configResponse as Record<string, unknown>;
          resolve(true);
        });
    });
  }
}
