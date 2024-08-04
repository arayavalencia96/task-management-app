import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedComponent } from './failed.component';
import { Router } from '@angular/router';

describe('FailedComponent', () => {
  let component: FailedComponent;
  let fixture: ComponentFixture<FailedComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FailedComponent],
      providers: [
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the details page', () => {      
    component.goToLanding();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});
