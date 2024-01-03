import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  loader = new EventEmitter();

  constructor() {}

  showLoader() {
    this.loader.emit(true);
  }
  hideLoader() {
    this.loader.emit(false);
  }
}
