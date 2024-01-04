import { Component } from '@angular/core';
import { Route } from 'src/app/constants/route';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  routes: string[];

  constructor() {
    this.routes = Object.values(Route);
  }
}
