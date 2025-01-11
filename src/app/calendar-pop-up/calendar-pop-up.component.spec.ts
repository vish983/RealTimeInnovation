import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPopUpComponent } from './calendar-pop-up.component';

describe('CalendarPopUpComponent', () => {
  let component: CalendarPopUpComponent;
  let fixture: ComponentFixture<CalendarPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarPopUpComponent]
    });
    fixture = TestBed.createComponent(CalendarPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
