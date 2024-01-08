import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from './constants/route';

const routes: Routes = [
  {
    path: Route.ReportExtraction,
    loadChildren: () =>
      import('./features/report-extraction/report-extraction.module').then(
        (m) => m.ReportExtractionModule
      ),
  },
    {
    path: Route.UploadData,
    loadChildren: () =>
      import('./features/upload-data/upload-data.module').then(
        (m) => m.UploadDataModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
