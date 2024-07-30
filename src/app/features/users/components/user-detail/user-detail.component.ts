import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';
import { selectUserById } from '@users/store/user.selectors';
import { User } from '@users/models/user.interface';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
})
export class UserDetailComponent {
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
      })
    );
  }
}
