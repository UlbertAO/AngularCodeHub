import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportExtractionComponent } from './report-extraction.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const ROUTES: Routes = [
  { path: '', component: ReportExtractionComponent },
];

@NgModule({
  declarations: [ReportExtractionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class ReportExtractionModule {}
