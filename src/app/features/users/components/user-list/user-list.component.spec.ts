import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ModalService } from '@shared/components/modal/modal.service';
import { UserListComponent } from './user-list.component';

import { User } from '@users/models/user.interface';
import { selectAllUsers } from '@users/store/user.selectors';
import {
  selectCurrentPage,
  selectItemsPerPage,
} from '@core/store/pagination/pagination.selectors';
import { setPage } from '@core/store/pagination/pagination.actions';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'User name 1',
      username: 'username1',
      email: 'username@gmail.com',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'User name 2',
      username: 'username1',
      email: 'username@gmail.com',
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
      imports: [UserListComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllUsers, value: mockUsers },
            { selector: selectCurrentPage, value: 1 },
            { selector: selectItemsPerPage, value: 10 },
          ],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UserListComponent);
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
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('users');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('create');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('form');
  });

  it('should initialize users and pagination correctly on ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentPage$).toBeTruthy();
    expect(component.itemsPerPage$).toBeTruthy();
    expect(component.users$).toBeTruthy();
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

  it('should call getAndFilterUsers on sortByCreatedAt method', () => {
    const getAndFilterUsersSpy = spyOn(component, 'getAndFilterUsers');

    component.sortByCreatedAt();
    expect(getAndFilterUsersSpy).toHaveBeenCalled();
  });
});
