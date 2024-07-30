import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowSectionService {
  private showUsersOrTasks = new BehaviorSubject<string>('tasks');
  showUsersOrTasks$ = this.showUsersOrTasks.asObservable();

  setIsForUsersOrTasks(section: string): void {
    this.showUsersOrTasks.next(section);
  }
}
