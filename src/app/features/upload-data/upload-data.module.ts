import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDataComponent } from './upload-data.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

export const ROUTES: Routes = [{ path: '', component: UploadDataComponent }];

@NgModule({
  declarations: [UploadDataComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), FormsModule],
})
export class UploadDataModule {}
