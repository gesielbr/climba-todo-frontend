import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchTerm as an empty string', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('should update searchTerm', () => {
    component.searchTerm.set('Angular');

    expect(component.searchTerm()).toBe('Angular');
  });
});
