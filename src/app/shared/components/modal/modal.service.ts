import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isVisibleSubject = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSubject.asObservable();

  private isForUsersOrTasks = new BehaviorSubject<string>('');
  isForUsersOrTasks$ = this.isForUsersOrTasks.asObservable();

  private isForCreateOrUpdate = new BehaviorSubject<string>('');
  isForCreateOrUpdate$ = this.isForCreateOrUpdate.asObservable();

  private isForDetailOrForm = new BehaviorSubject<string>('');
  isForDetailOrForm$ = this.isForDetailOrForm.asObservable();

  private id = new BehaviorSubject<string>('');
  id$ = this.id.asObservable();

  setID(id: string): void {
    this.id.next(id);
  }

  setIsForCreateOrUpdate(action: string): void {
    this.isForCreateOrUpdate.next(action);
  }

  setIsForUsersOrTasks(feature: string): void {
    this.isForUsersOrTasks.next(feature);
  }

  setIsForDetailOrForm(component: string): void {
    this.isForDetailOrForm.next(component);
  }

  open(): void {
    this.isVisibleSubject.next(true);
  }

  close(): void {
    this.isVisibleSubject.next(false);
  }
}
