import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';
import {
  selectTasksForUser,
  selectUserById,
} from '@users/store/user.selectors';
import { User } from '@users/models/user.interface';
import { Task } from '@tasks/models/task.interface';
import { TaskListComponent } from '@tasks/components/task-list/task-list.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, TaskListComponent],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  store = inject(Store);
  modalService = inject(ModalService);

  id: string = '';
  user: User | undefined = {
    createdAt: new Date(),
    email: '',
    id: '',
    name: '',
    updatedAt: new Date(),
    username: '',
  };

  tasks: Task[] = [];

  ngOnInit(): void {
    this.handleUserSelection();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleUserSelection(): void {
    this.subscriptions.add(
      this.modalService.id$.subscribe(id => {
        this.id = id;
        this.store.pipe(select(selectUserById(id))).subscribe(user => {
          this.user = user;
        });
        this.store.pipe(select(selectTasksForUser(id))).subscribe(tasks => {
          this.tasks = tasks;
        });
      })
    );
  }
}
