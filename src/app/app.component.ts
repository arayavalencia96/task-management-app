import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@core/components/navbar/navbar.component';

import { initFlowbite } from 'flowbite';
import { HomeComponent } from './features/home/home.component';
import { LandingComponent } from './features/landing/landing.component';
import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalModule,
  MsalService,
} from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  AccountInfo,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';
import { FooterComponent } from '@core/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    HomeComponent,
    LandingComponent,
    MsalModule,
    NavbarComponent,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  isIframe = false;
  loginDisplay = false;
  activeAccount: AccountInfo | null = null;

  ngOnInit(): void {
    initFlowbite();
    this.msalService?.handleRedirectObservable()?.subscribe();
    this.isIframe = window !== window.parent && !window.opener;

    this.setLoginDisplay();

    this.msalService?.instance.enableAccountStorageEvents();
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe(() => {
        if (this.msalService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
        this.getUserProfile();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService?.instance.getAllAccounts()?.length > 0;
  }

  checkAndSetActiveAccount() {
    let activeAccount = this.msalService?.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.msalService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
  }

  getUserProfile() {
    this.activeAccount = this.msalService.instance.getActiveAccount();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
