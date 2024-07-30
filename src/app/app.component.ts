import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from '@core/components/dashboard/dashboard.component';
import { ShowSectionService } from '@core/services/show-section.service';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { TaskListComponent } from '@tasks/components/task-list/task-list.component';
import { UserListComponent } from '@users/components/user-list/user-list.component';

import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    TaskListComponent,
    UserListComponent,
    ModalComponent,
    DashboardComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  showSectionService = inject(ShowSectionService);
  showUsersOrTasks: string = '';
  ngOnInit(): void {
    initFlowbite();
    this.subscriptions.add(
      this.showSectionService.showUsersOrTasks$.subscribe(section => {
        this.showUsersOrTasks = section;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
