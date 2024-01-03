import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExtractionComponent } from './report-extraction.component';

describe('ReportExtractionComponent', () => {
  let component: ReportExtractionComponent;
  let fixture: ComponentFixture<ReportExtractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportExtractionComponent]
    });
    fixture = TestBed.createComponent(ReportExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
