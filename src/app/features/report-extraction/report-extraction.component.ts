import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/core/services/admin.service';
import { AppSettingService } from 'src/app/core/utilities/app-setting.service';
import { EventEmitterService } from 'src/app/core/utilities/event-emitter.service';
import { ReportExtractionReqModal } from 'src/models/request-models/ReportExtractionReqModal';

@Component({
  selector: 'app-report-extraction',
  templateUrl: './report-extraction.component.html',
  styleUrls: ['./report-extraction.component.scss'],
})
export class ReportExtractionComponent {
  agentId: string | null;
  fromDate: Date | null;
  toDate: Date | null;
  today: Date = new Date();

  constructor(
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private eventEmitterService: EventEmitterService,
    private appSetting: AppSettingService
  ) {
    this.reset();
    this.appSetting.CorrelationId = this.appSetting.generateUUID();
  }

  reset() {
    this.agentId = null;
    this.fromDate = null;
    this.toDate = null;
  }

  checkDates() {
    if (this.fromDate == null || this.toDate == null) {
      this.fromDate = null;
      this.toDate = null;
      this._snackBar.open('Select Date in Range', 'close', {
        panelClass: 'warning-toast',
        duration: 5000,
      });
    }
  }

  downloadReport() {
    this.eventEmitterService.showLoader();
    let tempToDate: Date | null = null;
    if (this.toDate) {
      tempToDate = new Date(this.toDate);
      tempToDate?.setDate(tempToDate.getDate() + 1); //+1 as we need data for all day
    }
    this.appSetting.RequestId = this.appSetting.generateUUID();

    const payload: ReportExtractionReqModal = {
      RequestId: this.appSetting.RequestId,
      CorrelationId: this.appSetting.CorrelationId,
      agentId: this.agentId,
      startDateTime: this.fromDate,
      endDateTime: tempToDate,
    };
    this.adminService.getReport(payload).subscribe({
      next: (data) => {
        this.eventEmitterService.hideLoader();
        if (data.isSuccess) {
          let binary_string = window.atob(data.responses);
          const blob = new Blob([binary_string], { type: 'text/csv' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Report.csv';
          link.click();
        } else {
          this._snackBar.open(data.message, 'close', {
            panelClass: 'danger-toast',
            duration: 5000,
          });
        }
      },
      error: (error) => {
        this.eventEmitterService.hideLoader();

        this._snackBar.open('Something Went Wrong', 'close', {
          panelClass: 'danger-toast',
          duration: 5000,
        });
      },
    });
  }
}
