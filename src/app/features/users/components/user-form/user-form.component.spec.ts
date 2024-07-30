import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '@shared/components/modal/modal.service';
import { UserFormComponent } from './user-form.component';

import { selectUserById } from '@users/store/user.selectors';
import { addUser, updateUser } from '@users/store/user.actions';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;

  let idSubject: BehaviorSubject<string>;
  let isForUsersOrTasksSubject: BehaviorSubject<string>;
  let isForCreateOrUpdateSubject: BehaviorSubject<string>;

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
      'isForUsersOrTasks$',
      'close',
      'isForCreateOrUpdate$',
      'id$',
    ]);
    idSubject = new BehaviorSubject<string>('1');
    modalService.id$ = idSubject.asObservable();

    isForUsersOrTasksSubject = new BehaviorSubject<string>('users');
    modalService.isForUsersOrTasks$ = isForUsersOrTasksSubject.asObservable();

    isForCreateOrUpdateSubject = new BehaviorSubject<string>('create');
    modalService.isForCreateOrUpdate$ =
      isForCreateOrUpdateSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectUserById('1'), value: userMock }],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UserFormComponent);
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

    component.userForm.setValue({
      name: 'User name 1',
      username: 'username1',
      email: 'username@gmail.com',
    });
    component.sendForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      addUser({
        name: 'User name 1',
        username: 'username1',
        email: 'username@gmail.com',
      })
    );
  });

  it('should call updateTask when form is valid and isForCreateOrUpdate is "update"', () => {
    spyOn(store, 'dispatch').and.callFake(action => action);

    isForCreateOrUpdateSubject.next('update');
    component.userForm.setValue({
      name: 'Updated User',
      username: 'username1',
      email: 'username@gmail.com',
    });
    component.sendForm();

    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({
        userId: '1',
        name: 'Updated User',
        username: 'username1',
        email: 'username@gmail.com',
      })
    );
  });

  it('should display "Crear User" when isForCreateOrUpdate is "create"', () => {
    isForCreateOrUpdateSubject.next('create');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Crear User');
  });

  it('should display "Update User" when isForCreateOrUpdate is "update"', () => {
    isForCreateOrUpdateSubject.next('update');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Update User');
  });
});
