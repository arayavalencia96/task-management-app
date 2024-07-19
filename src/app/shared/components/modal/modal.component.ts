import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { ModalService } from './modal.service';
import { CommonModule } from '@angular/common';
import { combineLatest, Subscription } from 'rxjs';
import { TaskFormComponent } from '@tasks/components/task-form/task-form.component';
import { UserFormComponent } from '@users/components/user-form/user-form.component';
import { Task } from '@tasks/models/task.interface';
import { User } from '@users/models/user.interface';
import { TaskDetailComponent } from '@tasks/components/task-detail/task-detail.component';
import { UserDetailComponent } from '@users/components/user-detail/user-detail.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    TaskFormComponent,
    TaskDetailComponent,
    UserFormComponent,
    UserDetailComponent,
  ],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  private store = inject(Store);
  modalService = inject(ModalService);

  isForUsersOrTasks: string = '';
  isForDetailOrForm: string = '';
  task = input<Task>();
  user = input<User>();

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.modalService.isForUsersOrTasks$,
        this.modalService.isForDetailOrForm$,
      ]).subscribe(([isForUsersOrTasks, isForDetailOrForm]) => {
        this.isForUsersOrTasks = isForUsersOrTasks;
        this.isForDetailOrForm = isForDetailOrForm;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  close(): void {
    this.modalService.close();
  }
}
