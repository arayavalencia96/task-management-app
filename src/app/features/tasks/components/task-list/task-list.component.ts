import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { combineLatest, map, Observable, startWith, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { ModalService } from '@shared/components/modal/modal.service';

import { TaskItemComponent } from './../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

import { setPage } from '@core/store/pagination/pagination.actions';
import { selectAllTasks } from '@tasks/store/task.selectors';
import {
  selectCurrentPage,
  selectItemsPerPage,
} from '@core/store/pagination/pagination.selectors';

import { Task } from '@tasks/models/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskItemComponent,
    TaskFormComponent,
    ModalComponent,
  ],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  modalService = inject(ModalService);
  store = inject(Store);

  searchControl = new FormControl('');

  allTasks$ = this.store.select(selectAllTasks);
  currentPage$: Observable<number> = new Observable<number>();
  itemsPerPage$: Observable<number> = new Observable<number>();
  tasks$: Observable<Task[]> = new Observable<Task[]>();

  currentPage: number = 0;
  filteredList: Task[] = [];
  itemsPerPage: number = 0;
  sortByCreatedAtAsc: boolean = false;
  showCompleted: boolean | null = null; // null: muestra todas las tareas; true: muestra las completas; false: muestra las incompletas
  totalItems: number = 0;

  ngOnInit() {
    this.getDataFromPagination();
    this.getAndFilterTasks();
    this.currentPage$.subscribe(() => this.getAndFilterTasks());
  }

  getDataFromPagination(): void {
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.itemsPerPage$ = this.store.select(selectItemsPerPage);
  }

  getAndFilterTasks(): void {
    this.tasks$ = combineLatest([
      this.allTasks$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.currentPage$,
      this.itemsPerPage$,
    ]).pipe(
      map(([tasks, searchTerm, currentPage, itemsPerPage]) => {
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        this.filteredList = tasks.filter(
          task =>
            task.title
              .toLowerCase()
              .includes((searchTerm ?? '').toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes((searchTerm ?? '').toLowerCase())
        );

        if (this.showCompleted !== null) {
          this.filteredList = this.filteredList.filter(
            task => task.isCompleted === this.showCompleted
          );
        }

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
    this.modalService.setIsForUsersOrTasks('tasks');
    this.modalService.setIsForCreateOrUpdate('create');
    this.modalService.setIsForDetailOrForm('form');
  }

  sortByCreatedAt(): void {
    this.sortByCreatedAtAsc = !this.sortByCreatedAtAsc;
    this.getAndFilterTasks();
  }

  toggleCompletedFilter(showCompleted: boolean | null): void {
    this.toggleShowCompleted(showCompleted);
    this.getAndFilterTasks();
  }

  toggleShowCompleted(showCompleted: boolean | null): void {
    if (showCompleted === null) {
      this.showCompleted = true;
    } else if (showCompleted === true) {
      this.showCompleted = false;
    } else {
      this.showCompleted = null;
    }
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
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
