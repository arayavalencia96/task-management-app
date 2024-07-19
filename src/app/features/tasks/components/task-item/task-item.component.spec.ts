import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { TaskItemComponent } from './task-item.component';

import { ModalService } from '@shared/components/modal/modal.service';
import {
  markTaskAsCompleted,
  removeTask,
  unmarkTaskAsCompleted,
} from '@tasks/store/task.actions';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

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
      'open',
      'setID',
      'setIsForUsersOrTasks',
      'setIsForCreateOrUpdate',
      'setIsForDetailOrForm',
    ]);
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
      providers: [
        provideMockStore(),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TaskItemComponent);
    fixture.componentRef.setInput('task', mockTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call unmarkTaskAsCompleted when isCompleted variable is true on toggleCompletion method', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    component.toggleCompletion('1', true);

    expect(store.dispatch).toHaveBeenCalledWith(
      unmarkTaskAsCompleted({
        id: '1',
      })
    );
  });

  it('should call markTaskAsCompleted when isCompleted variable is false on toggleCompletion method', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    component.toggleCompletion('1', false);

    expect(store.dispatch).toHaveBeenCalledWith(
      markTaskAsCompleted({
        id: '1',
      })
    );
  });

  it('should call removeTask on removeTask method', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    component.removeTask('1');

    expect(store.dispatch).toHaveBeenCalledWith(
      removeTask({
        id: '1',
      })
    );
  });

  it('should call open, setID, setIsForUsersOrTasks, setIsForCreateOrUpdate, setIsForDetailOrForm on openModal method', () => {
    component.openModal('1', '');

    expect(modalService.open).toHaveBeenCalled();
    expect(modalService.setID).toHaveBeenCalledWith('1');
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('tasks');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('update');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('detail');
  });

  it('should call setIsForDetailOrForm with property form on openModal method when component is form', () => {
    component.openModal('1', 'form');

    expect(modalService.open).toHaveBeenCalled();
    expect(modalService.setID).toHaveBeenCalledWith('1');
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('tasks');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('update');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('form');
  });
});
