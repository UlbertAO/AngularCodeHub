import { Component } from '@angular/core';
import { EventEmitterService } from './core/utilities/event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  loader: boolean;

  constructor(private eventEmitterService: EventEmitterService) {}

  ngOnInit(): void {
    this.eventEmitterService.loader.subscribe((data) => {
      if (data) {
        this.loader = true;
      } else {
        this.loader = false;
      }
    });
  }
}
