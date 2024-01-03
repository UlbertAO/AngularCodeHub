import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingService } from '../utilities/app-setting.service';
import { ReportExtractionReqModal } from 'src/models/request-models/ReportExtractionReqModal';
import { ReportExtractionResModal } from 'src/models/response-models/ReportExtractionResModal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private appSetting: AppSettingService
  ) {}

  getReport(
    payload: ReportExtractionReqModal
  ): Observable<ReportExtractionResModal> {
    return this.http.post<ReportExtractionResModal>(
      this.appSetting.baseURLs?.ReportExtraction,
      payload
    );
  }
}
