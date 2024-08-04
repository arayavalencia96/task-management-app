import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { BehaviorSubject } from 'rxjs';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalService,
} from '@azure/msal-angular';
import {
  AccountInfo,
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';

import { ShowSectionService } from '@core/services/show-section.service';
import { HomeComponent } from './home.component';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
} from 'src/app/app.config';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let inProgress$: BehaviorSubject<InteractionStatus>;
  let msalBroadcastServiceMock: jasmine.SpyObj<MsalBroadcastService>;
  let msalServiceMock: jasmine.SpyObj<MsalService>;
  let msalSubject$: BehaviorSubject<EventMessage>;
  let showSectionServiceMock: jasmine.SpyObj<ShowSectionService>;
  let showUsersOrTasks: BehaviorSubject<string>;

  beforeEach(async () => {
    showSectionServiceMock = jasmine.createSpyObj('ShowSectionService', [
      'showUsersOrTasks$',
    ]);
    showUsersOrTasks = new BehaviorSubject<string>('users');
    showSectionServiceMock.showUsersOrTasks$ = showUsersOrTasks.asObservable();

    msalSubject$ = new BehaviorSubject<EventMessage>({
      eventType: EventType.LOGIN_SUCCESS,
      payload: { account: {} } as AuthenticationResult,
      interactionType: null,
      error: null,
      timestamp: Date.now(),
    });
    inProgress$ = new BehaviorSubject<InteractionStatus>(
      InteractionStatus.None
    );

    msalBroadcastServiceMock = jasmine.createSpyObj('MsalBroadcastService', [
      'msalSubject$',
      'inProgress$',
    ]);
    msalBroadcastServiceMock.msalSubject$ = msalSubject$.asObservable();
    msalBroadcastServiceMock.inProgress$ = inProgress$.asObservable();

    msalServiceMock = jasmine.createSpyObj('MsalService', ['instance']);
    msalServiceMock.instance = jasmine.createSpyObj('MsalInstance', [
      'setActiveAccount',
      'getAllAccounts',
    ]);
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ShowSectionService, useValue: showSectionServiceMock },
        provideMockStore(),
        { provide: MsalService, useValue: msalServiceMock },
        MsalGuard,
        { provide: MsalBroadcastService, useValue: msalBroadcastServiceMock },
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory,
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory,
        },
      ],
    }).compileComponents();

    TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle LOGIN_SUCCESS event and set active account', () => {
    const mockAccount: AccountInfo = {
      homeAccountId: 'homeAccountId',
      environment: 'environment',
      tenantId: 'tenantId',
      username: 'username',
      localAccountId: 'localAccountId',
      name: 'name',
      idToken: 'idToken',
    };
    const mockResult: EventMessage = {
      eventType: EventType.LOGIN_SUCCESS,
      payload: { account: mockAccount } as AuthenticationResult,
      interactionType: null,
      error: null,
      timestamp: Date.now(),
    };

    msalSubject$.next(mockResult);
    fixture.detectChanges();

    expect(msalServiceMock.instance.setActiveAccount).toHaveBeenCalledWith(
      mockAccount
    );
  });

  it('should call setLoginDisplay on InteractionStatus.None', () => {
    const setLoginDisplaySpy = spyOn(
      component,
      'setLoginDisplay'
    ).and.callThrough();

    inProgress$.next(InteractionStatus.None);
    fixture.detectChanges();

    expect(setLoginDisplaySpy).toHaveBeenCalled();
  });

  it('should update loginDisplay based on accounts length', () => {
    (
      msalServiceMock.instance as jasmine.SpyObj<any>
    ).getAllAccounts.and.returnValue([
      { homeAccountId: 'homeAccountId' },
    ] as AccountInfo[]);

    component.setLoginDisplay();
    fixture.detectChanges();

    expect(component.loginDisplay).toBeTrue();
  });
});
