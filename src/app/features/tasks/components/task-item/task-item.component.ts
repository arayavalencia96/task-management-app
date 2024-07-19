import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Store } from '@ngrx/store';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalService } from '@shared/components/modal/modal.service';

import {
  markTaskAsCompleted,
  removeTask,
  unmarkTaskAsCompleted,
} from '@tasks/store/task.actions';
import { Task } from '@tasks/models/task.interface';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  store = inject(Store);
  modalService = inject(ModalService);

  task = input.required<Task>();

  toggleCompletion(id: string, isCompleted: boolean): void {
    if (isCompleted) {
      this.store.dispatch(unmarkTaskAsCompleted({ id }));
    } else {
      this.store.dispatch(markTaskAsCompleted({ id }));
    }
  }

  removeTask(id: string): void {
    this.store.dispatch(removeTask({ id }));
  }

  openModal(id: string, component: string): void {
    this.modalService.open();
    this.modalService.setID(id);
    this.modalService.setIsForUsersOrTasks('tasks');
    this.modalService.setIsForCreateOrUpdate('update');
    if (component === 'form') {
      this.modalService.setIsForDetailOrForm('form');
    } else {
      this.modalService.setIsForDetailOrForm('detail');
    }
  }
}
