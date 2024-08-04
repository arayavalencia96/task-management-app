import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';

import { LandingComponent } from './landing.component';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let msalServiceMock: jasmine.SpyObj<MsalService>;

  beforeEach(async () => {
    msalServiceMock = jasmine.createSpyObj('MsalService', [
      'loginRedirect',
      'logoutRedirect',
    ]);
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [{ provide: MsalService, useValue: msalServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginRedirect on login button click', () => {
    const loginButton = fixture.debugElement.query(
      By.css('button')
    ).nativeElement;
    loginButton.click();

    expect(msalServiceMock.loginRedirect).toHaveBeenCalled();
  });
});
