import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    await fixture.whenStable();

    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the logo', () => {
    expect(compiled.querySelector('.logo-circle')?.textContent?.trim()).toBe('GO');
  });

  it('should render two navigation links', () => {
    expect(compiled.querySelectorAll('.nav-link').length).toBe(2);
  });

  it('should mark the Home link as active', () => {
    const homeLink = compiled.querySelector('.nav-link');

    expect(homeLink?.classList.contains('active')).toBe(true);
  });
});
