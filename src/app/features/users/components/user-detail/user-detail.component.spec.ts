import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '@shared/components/modal/modal.service';
import { UserDetailComponent } from './user-detail.component';

import { selectUserById } from '@users/store/user.selectors';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;
  let idSubject: BehaviorSubject<string>;

  const userMock = {
    id: '1',
    name: 'User name 1',
    username: 'username1',
    email: 'username@gmail.com',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-01'),
  };

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('ModalService', ['id$', 'setID']);
    idSubject = new BehaviorSubject<string>('1');
    modalService.id$ = idSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectUserById('1'), value: userMock }],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectUserById('1'), userMock);
    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to modalService.id$ and update id', async () => {
    modalService.setID('1');
    fixture.detectChanges();

    await new Promise<void>(resolve => {
      modalService.id$.subscribe(id => {
        expect(component.id).toBe('1');
        resolve();
      });
    });
  });

  it('should call handleUserSelection() correctly', () => {
    const handleUserSelectionSpy = spyOn(component, 'handleUserSelection');
    component.ngOnInit();
    expect(handleUserSelectionSpy).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should add on init', () => {
    const addSpy = spyOn(component['subscriptions'], 'add');
    component.ngOnInit();
    expect(addSpy).toHaveBeenCalled();
  });

  it('should display task title', () => {
    component.user = userMock;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent)?.toContain('User name 1');
    expect(
      compiled.querySelector('[data-testid="user-email"]').textContent
    ).toContain('username@gmail.com');
    expect(
      compiled.querySelector('[data-testid="user-username"]').textContent
    ).toContain('username1');
  });
});
