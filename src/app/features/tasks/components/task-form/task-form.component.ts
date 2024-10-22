import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { combineLatest, Observable, of, Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';

import { Task } from '@tasks/models/task.interface';
import { addTask, updateTask } from '@tasks/store/task.actions';
import { selectTaskById } from '@tasks/store/task.selectors';
import { selectAllUsers } from '@users/store/user.selectors';
import { User } from '@users/models/user.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  store = inject(Store);
  formBuilder = inject(FormBuilder);
  modalService = inject(ModalService);

  id: string = '';
  isForCreateOrUpdate: string = '';
  task: Task | undefined = {
    id: '',
    deadline: '',
    title: '',
    description: '',
    isCompleted: false,
    createdAt: new Date(),
  };
  user: User | undefined = {
    id: '',
    name: '',
    username: '',
    email: '',
    createdAt: new Date(),
    tasks: [],
  };
  users$: Observable<User[]> = new Observable<User[]>();

  taskForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    user: [''],
    deadline: [''],
  });

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.modalService.isForUsersOrTasks$,
        this.store.select(selectAllUsers),
      ]).subscribe(([isForUsersOrTasks, allUsers$]) => {
        if (isForUsersOrTasks === 'tasks') {
          this.handleCreateOrUpdate();
        }
        this.users$ = of(allUsers$);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addTask(): void {
    if (this.taskForm.valid) {
      this.store.dispatch(
        addTask({
          title: this.taskForm.get('title')?.value ?? '',
          description: this.taskForm.get('description')?.value ?? '',
          userID: this.taskForm.get('user')?.value ?? '',
          deadline: this.taskForm.get('deadline')?.value ?? '',
        })
      );
      this.taskForm.reset();
      this.subscriptions.add(this.modalService.close());
    }
  }

  sendForm(): void {
    if (this.isForCreateOrUpdate === 'create') {
      this.addTask();
    } else {
      this.updateTask();
    }
  }

  setValuesFromForm(): void {
    this.taskForm.patchValue({
      title: this.task?.title,
      description: this.task?.description,
      user: this.task?.userID,
      deadline: this.task?.deadline,
    });
  }

  updateTask(): void {
    if (this.taskForm.valid) {
      this.store.dispatch(
        updateTask({
          taskId: this.id,
          title: this.taskForm.get('title')?.value ?? '',
          description: this.taskForm.get('description')?.value ?? '',
          userID: this.taskForm.get('user')?.value ?? '',
          deadline: this.taskForm.get('deadline')?.value ?? '',
        })
      );
      this.taskForm.reset();
      this.subscriptions.add(this.modalService.close());
    }
  }

  private handleCreateOrUpdate(): void {
    this.subscriptions.add(
      this.modalService.isForCreateOrUpdate$.subscribe(res => {
        this.isForCreateOrUpdate = res;
        if (this.isForCreateOrUpdate === 'update') {
          this.handleTaskSelection();
        }
      })
    );
  }

  private handleTaskSelection(): void {
    this.subscriptions.add(
      this.modalService.id$.subscribe(id => {
        this.id = id;
        this.subscriptions.add(
          this.store.pipe(select(selectTaskById(id))).subscribe(task => {
            this.task = task;
            this.setValuesFromForm();
          })
        );
      })
    );
  }
}
