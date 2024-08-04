import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { DashboardComponent } from '@core/components/dashboard/dashboard.component';
import { ShowSectionService } from '@core/services/show-section.service';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { TaskListComponent } from '@tasks/components/task-list/task-list.component';
import { UserListComponent } from '@users/components/user-list/user-list.component';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  InteractionStatus,
} from '@azure/msal-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    TaskListComponent,
    UserListComponent,
    ModalComponent,
    DashboardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  msalBroadcastService = inject(MsalBroadcastService);
  msalService = inject(MsalService);
  showSectionService = inject(ShowSectionService);

  loginDisplay = false;
  showUsersOrTasks: string = '';

  ngOnInit(): void {
    this.subscriptions.add(
      this.showSectionService.showUsersOrTasks$.subscribe(section => {
        this.showUsersOrTasks = section;
      })
    );
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(payload.account);
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.msalService.instance.getAllAccounts()?.length > 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
