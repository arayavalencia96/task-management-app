import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { ModalService } from '@shared/components/modal/modal.service';

import { Task } from '@tasks/models/task.interface';
import { selectTaskById } from '@tasks/store/task.selectors';

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
    isCompleted: false,
    createdAt: new Date(),
  };

  ngOnInit(): void {
    this.handleTaskSelection();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  handleTaskSelection(): void {
    this.subscriptions.add(
      this.modalService.id$.subscribe(id => {
        this.id = id;
        this.store.pipe(select(selectTaskById(id))).subscribe(task => {
          this.task = task;
        });
      })
    );
  }
}
