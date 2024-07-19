import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalService } from '@shared/components/modal/modal.service';

import { TaskListComponent } from './task-list.component';

import { setPage } from '@core/store/pagination/pagination.actions';
import {
  selectCurrentPage,
  selectItemsPerPage,
} from './../../../../core/store/pagination/pagination.selectors';
import { selectAllTasks } from '@tasks/store/task.selectors';

import { Task } from '@tasks/models/task.interface';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      deadline: '2024-12-31',
      isCompleted: false,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      deadline: '2024-12-31',
      isCompleted: true,
      createdAt: new Date('2024-01-01'),
    },
  ];

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('ModalService', [
      'open',
      'setIsForUsersOrTasks',
      'setIsForCreateOrUpdate',
      'setIsForDetailOrForm',
    ]);
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllTasks, value: mockTasks },
            { selector: selectCurrentPage, value: 1 },
            { selector: selectItemsPerPage, value: 10 },
          ],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modalService.open and set modal properties when openModal is called', () => {
    component.openModal();
    expect(modalService.open).toHaveBeenCalled();
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('tasks');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('create');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('form');
  });

  it('should initialize tasks and pagination correctly on ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentPage$).toBeTruthy();
    expect(component.itemsPerPage$).toBeTruthy();
    expect(component.tasks$).toBeTruthy();
  });

  it('should dispatch setPage action when nextPage is called', () => {
    spyOn(store, 'dispatch');
    component.nextPage();
    expect(store.dispatch).toHaveBeenCalledWith(setPage({ page: 2 }));
  });

  it('should not dispatch setPage action when prevPage is called and currentPage is 1', () => {
    spyOn(store, 'dispatch');
    component.currentPage = 1;
    component.prevPage();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return true for canGoNext when there are more tasks to show', () => {
    component.currentPage = 1;
    component.itemsPerPage = 1;
    component.totalItems = 2;
    expect(component.canGoNext()).toBeTrue();
  });

  it('should return false for canGoNext when there are no more tasks to show', () => {
    component.currentPage = 1;
    component.itemsPerPage = 2;
    component.totalItems = 2;
    expect(component.canGoNext()).toBeFalse();
  });

  it('should return true for canGoPrev when currentPage is greater than 1', () => {
    component.currentPage = 2;
    expect(component.canGoPrev()).toBeTrue();
  });

  it('should return false for canGoPrev when currentPage is 1', () => {
    component.currentPage = 1;
    expect(component.canGoPrev()).toBeFalse();
  });

  it('should call getAndFilterTasks on sortByCreatedAt method', () => {
    const getAndFilterTasksSpy = spyOn(component, 'getAndFilterTasks');

    component.sortByCreatedAt();
    expect(getAndFilterTasksSpy).toHaveBeenCalled();
  });

  it('should call toggleShowCompleted on toggleCompletedFilter method', () => {
    const toggleShowCompletedSpy = spyOn(component, 'toggleShowCompleted');

    component.toggleCompletedFilter(true);
    expect(toggleShowCompletedSpy).toHaveBeenCalled();
  });

  it('should showCompleted be true when showCompleted is null on toggleShowCompleted method', () => {
    component.toggleShowCompleted(null);
    expect(component.showCompleted).toBeTrue();
  });

  it('should showCompleted be null when showCompleted is false on toggleShowCompleted method', () => {
    component.toggleShowCompleted(false);
    expect(component.showCompleted).toBeNull();
  });

  it('should showCompleted be false when showCompleted is true on toggleShowCompleted method', () => {
    component.toggleShowCompleted(true);
    expect(component.showCompleted).toBeFalse();
  });
});
