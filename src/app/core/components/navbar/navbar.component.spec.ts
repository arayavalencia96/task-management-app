import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MsalService } from '@azure/msal-angular';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let msalServiceMock: jasmine.SpyObj<MsalService>;

  beforeEach(async () => {
    msalServiceMock = jasmine.createSpyObj('MsalService', ['loginRedirect', 'logoutRedirect']);
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginRedirect on login button click', () => {
    component.loginDisplay = false;
    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css('button')).nativeElement;
    loginButton.click();

    expect(msalServiceMock.loginRedirect).toHaveBeenCalled();
  });

  it('should call logoutRedirect on logout button click', () => {
    component.loginDisplay = true;
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('button')).nativeElement;
    logoutButton.click();

    expect(msalServiceMock.logoutRedirect).toHaveBeenCalled();
  });
});
