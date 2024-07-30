import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';

import { Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';

import { ModalComponent } from '@shared/components/modal/modal.component';

import { removeUser } from '@users/store/user.actions';
import { User } from '@users/models/user.interface';

@Component({
  selector: 'app-user-item',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './user-item.component.html',
})
export class UserItemComponent {
  store = inject(Store);
  modalService = inject(ModalService);

  user = input.required<User>();

  removeUser(id: string): void {
    this.store.dispatch(removeUser({ id }));
  }

  openModal(id: string, component: string): void {
    this.modalService.open();
    this.modalService.setID(id);
    this.modalService.setIsForUsersOrTasks('users');
    this.modalService.setIsForCreateOrUpdate('update');
    if (component === 'form') {
      this.modalService.setIsForDetailOrForm('form');
    } else {
      this.modalService.setIsForDetailOrForm('detail');
    }
  }
}
