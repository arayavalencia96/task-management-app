import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Subscription, switchMap } from 'rxjs';

import { ModalService } from '@shared/components/modal/modal.service';

import { Task } from '@tasks/models/task.interface';
import { selectTaskById } from '@tasks/store/task.selectors';
import { selectUserById } from '@users/store/user.selectors';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./task-detail.component.css'],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  store = inject(Store);
  modalService = inject(ModalService);

  id: string = '';
  task: Task | undefined = {
    id: '',
    deadline: '',
    title: '',
    description: '',
    userID: '',
    isCompleted: false,
    createdAt: new Date(),
  };
  user?: string = '';

  ngOnInit(): void {
    this.handleTaskSelection();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleTaskSelection(): void {
    this.subscriptions.add(
      this.modalService.id$
        .pipe(
          switchMap(id => {
            this.id = id;
            return this.store.pipe(select(selectTaskById(id)));
          }),
          switchMap(task => {
            this.task = task;
            return this.store.pipe(select(selectUserById(this.task?.userID)));
          })
        )
        .subscribe(user => {
          this.user = user?.name;
        })
    );
  }
}
