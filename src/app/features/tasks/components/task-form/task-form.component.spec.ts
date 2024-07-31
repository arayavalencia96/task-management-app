import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '@shared/components/modal/modal.service';
import { TaskFormComponent } from './task-form.component';

import { addTask, updateTask } from '@tasks/store/task.actions';
import { selectTaskById } from '@tasks/store/task.selectors';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

  let idSubject: BehaviorSubject<string>;
  let isForUsersOrTasksSubject: BehaviorSubject<string>;
  let isForCreateOrUpdateSubject: BehaviorSubject<string>;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    deadline: '2024-12-31',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-01'),
  };

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('ModalService', [
      'isForUsersOrTasks$',
      'close',
      'isForCreateOrUpdate$',
      'id$',
    ]);
    idSubject = new BehaviorSubject<string>('1');
    modalService.id$ = idSubject.asObservable();

    isForUsersOrTasksSubject = new BehaviorSubject<string>('tasks');
    modalService.isForUsersOrTasks$ = isForUsersOrTasksSubject.asObservable();

    isForCreateOrUpdateSubject = new BehaviorSubject<string>('create');
    modalService.isForCreateOrUpdate$ =
      isForCreateOrUpdateSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTaskById('1'), value: mockTask }],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addTask when form is valid and isForCreateOrUpdate is "create"', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    component.taskForm.setValue({
      title: 'New Task',
      description: 'New Description',
      user: '',
      deadline: '2024-07-20',
    });
    component.sendForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      addTask({
        title: 'New Task',
        description: 'New Description',
        userID: '',
        deadline: '2024-07-20',
      })
    );
  });

  it('should call updateTask when form is valid and isForCreateOrUpdate is "update"', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    isForCreateOrUpdateSubject.next('update');
    component.taskForm.setValue({
      title: 'Updated Task',
      description: 'Updated Description',
      user: '',
      deadline: '2024-07-21',
    });
    component.sendForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      updateTask({
        taskId: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        userID: '',
        deadline: '2024-07-21',
      })
    );
  });

  it('should display "Crear Task" when isForCreateOrUpdate is "create"', () => {
    isForCreateOrUpdateSubject.next('create');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Crear Task');
  });

  it('should display "Update Task" when isForCreateOrUpdate is "update"', () => {
    isForCreateOrUpdateSubject.next('update');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Update Task');
  });
});
