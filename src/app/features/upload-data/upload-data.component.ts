import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import { Route } from 'src/app/constants/route';
import { Variables } from 'src/app/constants/variables';
import { AdminService } from 'src/app/core/services/admin.service';
import { AppSettingService } from 'src/app/core/utilities/app-setting.service';
import { EventEmitterService } from 'src/app/core/utilities/event-emitter.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss'],
})
export class UploadDataComponent {
  kbFile: any | null = null;
  mandatoryHeaders = Variables.uploadMandatoryHeaders;
  uploadRoute = Route.UploadData;
  loader: boolean;
  uploadStatus: {
    status: boolean;
    msg: string;
  } | null = null;
  @ViewChild('uploaderLoader', { static: false }) uploaderLoaderRef: ElementRef;
  uploaderLoader: HTMLElement;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private adminService: AdminService,
    public appSetting: AppSettingService,
    private loaderEmitter: EventEmitterService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.uploaderLoader = this.uploaderLoaderRef.nativeElement;
    this.appSetting.CorrelationId = this.appSetting.generateUUID();
  }
  ngOnInit() {
    this.loaderEmitter.loader.subscribe((data) => {
      if (data == 'true') {
        this.loader = true;
      } else {
        this.loader = false;
      }
    });
  }

  onFileChange(event: Event) {
    const pFileList: FileList | null = (event.target as HTMLInputElement).files;
    this.validateFile(pFileList);
  }

  validateFile(pFileList: FileList | null) {
    if (pFileList) {
      this.kbFile = pFileList[0];

      this.changeDetectorRef.detectChanges();
      this.uploaderLoader = this.uploaderLoaderRef.nativeElement;

      // Validate file is xlsx
      if (!this.kbFile.name.endsWith('.xlsx')) {
        this.uploadStatus = {
          status: false,
          msg: 'Please upload MS excel document only with .xlsx format',
        };
        this.uploaderLoader.style.borderColor = '#d60000';
        return;
      }

      // Validate file size (in bytes)
      const maxSizeInBytes = Variables.uploadFileSizeLimit * 1024 * 1024; // For example, 5 MB
      if (this.kbFile.size > maxSizeInBytes) {
        this.uploadStatus = {
          status: false,
          msg: 'File size exceeds the limit.',
        };
        this.uploaderLoader.style.borderColor = '#d60000';
        return;
      }

      // validate headers and col values
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(this.kbFile);
      reader.onload = (e) => {
        const binarystr: string | ArrayBuffer | null = reader.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        // selected the first sheet
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // validate header
        const headers: string[] = [];
        const columnCount = XLSX.utils.decode_range(ws['!ref'] || '').e.c + 1; // get col count !ref is range A1:G1
        for (let i = 0; i < columnCount; ++i) {
          headers[i] = ws[`${XLSX.utils.encode_col(i)}1`].v; // get values of 1 col
        }

        // headers.forEach((headerVal) =>
        for (const headerVal of headers) {
          if (
            !this.mandatoryHeaders
              .map((x) => x.toLocaleLowerCase())
              .includes(headerVal.toLocaleLowerCase())
          ) {
            this.uploadStatus = {
              status: false,
              msg: 'Mandatory headers are missing OR Unecessary headers are present',
            };
            this.uploaderLoader.style.borderColor = '#d60000';
            return;
          }
        }

        // validate values in each col
        const data = XLSX.utils.sheet_to_json(ws);
        let blankEntriesRow = '';
        let rowCount = 1;
        // data.forEach((row: any) =>
        for (const row of data) {
          if (!this.mandatoryHeaderKeyCheck(row)) {
            blankEntriesRow += rowCount + ', ';
          }
          rowCount++;
        }
        if (blankEntriesRow) {
          this.uploadStatus = {
            status: false,
            msg:
              'We have found blank details against the entries in row(s) ' +
              blankEntriesRow +
              'please verify and reupload the document.',
          };
          this.uploaderLoader.style.borderColor = '#d60000';
          return;
        }

        // validation completed
        this.uploadKb();
      };
    }
  }
  mandatoryHeaderKeyCheck(row: any): boolean {
    const rowKeys = Object.keys(row);
    // this.mandatoryHeaders.forEach((headerVal) =>
    for (const headerVal of this.mandatoryHeaders) {
      if (
        !rowKeys
          .map((y) => y.toLocaleLowerCase())
          .includes(headerVal.toLocaleLowerCase())
      ) {
        // mandatory header not in row
        return false;
      }
      // mandatory header is in row
      if (!row[headerVal].toString().trim()) {
        // if empty value if there
        return false;
      }
    }
    return true;
  }
  uploadKb() {
    if (this.kbFile) {
      const dReader: FileReader = new FileReader();
      dReader.readAsBinaryString(this.kbFile);
      dReader.onload = (e: any) => {
        const fileData = btoa(e.target.result.toString());
        this.appSetting.RequestId = this.appSetting.generateUUID();
        const payload = {
          RequestId: this.appSetting.RequestId,
          CorrelationId: this.appSetting.CorrelationId,
          FileBytesData: fileData,
          FileName: this.kbFile.name.split('.')[0],
        };
        this.adminService
          .uploadData(payload)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (data) => {
              if (data.isSuccess) {
                this.uploadStatus = {
                  status: true,
                  msg: '',
                };
                this.uploaderLoader.style.borderColor = '#00911c';
              } else {
                this.uploadStatus = {
                  status: false,
                  msg: 'Something Went Wrong',
                };
                this.uploaderLoader.style.borderColor = '#d60000';
              }
            },
            error: (error) => {
              this.uploadStatus = {
                status: false,
                msg: 'Something Went Wrong',
              };
              this.uploaderLoader.style.borderColor = '#d60000';
            },
          });
      };
    }
  }
  reset() {
    // const fileInput = document.getElementById('file') as HTMLInputElement;
    // fileInput.value = ''; // Clearing the input value
    // This aborts all HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();

    this.kbFile = null;
  }
  onDragOver(event: any) {
    event.preventDefault();

    if (!this.kbFile) {
      // if something is already in kbfile do not activate drag drop
      const draggableArea = document.querySelector(
        '.uploader-container'
      ) as HTMLInputElement;
      if (!draggableArea.classList.contains('dragOver')) {
        draggableArea.classList.add('dragOver');
      }
    }
  }

  onDropSuccess(event: any) {
    event.preventDefault();

    if (!this.kbFile) {
      // if something is already in kbfile do not activate drag drop
      const draggableArea = document.querySelector(
        '.uploader-container'
      ) as HTMLInputElement;

      draggableArea.classList.remove('dragOver');

      this.validateFile(event.dataTransfer.files); // notice the "dataTransfer" used instead of "target"
    }
  }
}
