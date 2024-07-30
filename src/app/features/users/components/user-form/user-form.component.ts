import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';

import { User } from '@users/models/user.interface';
import { updateUser, addUser } from '@users/store/user.actions';
import { selectUserById } from '@users/store/user.selectors';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  store = inject(Store);
  formBuilder = inject(FormBuilder);
  modalService = inject(ModalService);

  userForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required]],
  });

  id: string = '';
  isForCreateOrUpdate: string = '';
  user: User | undefined = {
    createdAt: new Date(),
    email: '',
    id: '',
    name: '',
    updatedAt: new Date(),
    username: '',
  };

  ngOnInit(): void {
    this.subscriptions.add(
      this.modalService.isForUsersOrTasks$.subscribe(res => {
        if (res === 'users') {
          this.handleCreateOrUpdate();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addUser(): void {
    if (this.userForm.valid) {
      this.store.dispatch(
        addUser({
          name: this.userForm.get('name')?.value ?? '',
          email: this.userForm.get('email')?.value ?? '',
          username: this.userForm.get('username')?.value ?? '',
        })
      );
      this.userForm.reset();
      this.subscriptions.add(this.modalService.close());
    }
  }

  sendForm(): void {
    if (this.isForCreateOrUpdate === 'create') {
      this.addUser();
    } else {
      this.updateUser();
    }
  }

  setValuesFromForm(): void {
    this.userForm.patchValue({
      name: this.user?.name,
      username: this.user?.username,
      email: this.user?.email,
    });
  }

  updateUser(): void {
    if (this.userForm.valid) {
      this.store.dispatch(
        updateUser({
          userId: this.id,
          name: this.userForm.get('name')?.value ?? '',
          username: this.userForm.get('username')?.value ?? '',
          email: this.userForm.get('email')?.value ?? '',
        })
      );
      this.userForm.reset();
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
          this.store.pipe(select(selectUserById(id))).subscribe(user => {
            this.user = user;
            this.setValuesFromForm();
          })
        );
      })
    );
  }
}
