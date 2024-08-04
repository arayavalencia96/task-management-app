import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { combineLatest, map, Observable, startWith, take } from 'rxjs';

import { Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';

import { UserFormComponent } from '../user-form/user-form.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { UserItemComponent } from '../user-item/user-item.component';

import { setPage } from '@core/store/pagination/pagination.actions';
import {
  selectCurrentPage,
  selectItemsPerPage,
} from '@core/store/pagination/pagination.selectors';
import { selectAllUsers } from '@users/store/user.selectors';
import { User } from '@users/models/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserItemComponent,
    UserFormComponent,
    ModalComponent,
  ],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  modalService = inject(ModalService);
  store = inject(Store);

  searchControl = new FormControl('');

  allUsers$ = this.store.select(selectAllUsers);
  currentPage$: Observable<number> = new Observable<number>();
  itemsPerPage$: Observable<number> = new Observable<number>();
  users$: Observable<User[]> = new Observable<User[]>();

  currentPage: number = 0;
  filteredList: User[] = [];
  itemsPerPage: number = 0;
  sortByCreatedAtAsc: boolean = false;
  totalItems: number = 0;

  ngOnInit() {
    this.getDataFromPagination();
    this.getAndFilterUsers();
    this.currentPage$.subscribe(() => this.getAndFilterUsers());
  }

  getDataFromPagination(): void {
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.itemsPerPage$ = this.store.select(selectItemsPerPage);
  }

  getAndFilterUsers(): void {
    this.users$ = combineLatest([
      this.allUsers$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.currentPage$,
      this.itemsPerPage$,
    ]).pipe(
      map(([users, searchTerm, currentPage, itemsPerPage]) => {
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.filteredList = users.filter(
          task =>
            task.name
              .toLowerCase()
              .includes((searchTerm ?? '').toLowerCase()) ||
            task.username
              ?.toLowerCase()
              .includes((searchTerm ?? '').toLowerCase()) ||
            task.email?.toLowerCase().includes((searchTerm ?? '').toLowerCase())
        );

        if (this.sortByCreatedAtAsc !== null) {
          this.filteredList.sort((a, b) =>
            this.sortByCreatedAtAsc
              ? new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
          );
        }

        this.totalItems = this.filteredList.length;
        return this.filteredList.slice(startIndex, endIndex);
      })
    );
  }

  openModal(): void {
    this.modalService.open();
    this.modalService.setIsForUsersOrTasks('users');
    this.modalService.setIsForCreateOrUpdate('create');
    this.modalService.setIsForDetailOrForm('form');
  }

  sortByCreatedAt(): void {
    this.sortByCreatedAtAsc = !this.sortByCreatedAtAsc;
    this.getAndFilterUsers();
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }

  nextPage() {
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      this.store.dispatch(setPage({ page: currentPage + 1 }));
    });
  }

  prevPage() {
    this.currentPage$.pipe(take(1)).subscribe(currentPage => {
      if (currentPage > 1) {
        this.store.dispatch(setPage({ page: currentPage - 1 }));
      }
    });
  }

  canGoNext(): boolean {
    return this.currentPage * this.itemsPerPage < this.totalItems;
  }

  canGoPrev(): boolean {
    return this.currentPage > 1;
  }
}
