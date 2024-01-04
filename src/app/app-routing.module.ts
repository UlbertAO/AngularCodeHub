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
