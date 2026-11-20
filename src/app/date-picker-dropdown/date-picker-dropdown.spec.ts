import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerDropdown } from './date-picker-dropdown';

describe('DatePickerDropdown', () => {
  let component: DatePickerDropdown;
  let fixture: ComponentFixture<DatePickerDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePickerDropdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
