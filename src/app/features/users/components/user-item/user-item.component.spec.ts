import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '@shared/components/modal/modal.service';
import { UserItemComponent } from './user-item.component';

import { removeUser } from '@users/store/user.actions';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

  const userMock = {
    id: '1',
    name: 'User name 1',
    username: 'username1',
    email: 'username@gmail.com',
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
      imports: [UserItemComponent],
      providers: [
        provideMockStore(),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UserItemComponent);
    fixture.componentRef.setInput('user', userMock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call removeUser on removeUser method', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    component.removeUser('1');

    expect(store.dispatch).toHaveBeenCalledWith(
      removeUser({
        id: '1',
      })
    );
  });

  it('should call open, setID, setIsForUsersOrTasks, setIsForCreateOrUpdate, setIsForDetailOrForm on openModal method', () => {
    component.openModal('1', '');

    expect(modalService.open).toHaveBeenCalled();
    expect(modalService.setID).toHaveBeenCalledWith('1');
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('users');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('update');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('detail');
  });

  it('should call setIsForDetailOrForm with property form on openModal method when component is form', () => {
    component.openModal('1', 'form');

    expect(modalService.open).toHaveBeenCalled();
    expect(modalService.setID).toHaveBeenCalledWith('1');
    expect(modalService.setIsForUsersOrTasks).toHaveBeenCalledWith('users');
    expect(modalService.setIsForCreateOrUpdate).toHaveBeenCalledWith('update');
    expect(modalService.setIsForDetailOrForm).toHaveBeenCalledWith('form');
  });
});
