import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;
  let isForUsersOrTasksSubject: BehaviorSubject<string>;
  let isForDetailOrFormSubject: BehaviorSubject<string>;
  let isVisibleSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    modalService = jasmine.createSpyObj('ModalService', [
      'isForUsersOrTasks$',
      'isForDetailOrForm$',
      'close',
    ]);
    isForUsersOrTasksSubject = new BehaviorSubject<string>('tasks');
    isForDetailOrFormSubject = new BehaviorSubject<string>('form');
    isVisibleSubject = new BehaviorSubject<boolean>(true);

    modalService.isForUsersOrTasks$ = isForUsersOrTasksSubject.asObservable();
    modalService.isForDetailOrForm$ = isForDetailOrFormSubject.asObservable();
    modalService.isVisible$ = isVisibleSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        provideMockStore(),
        { provide: ModalService, useValue: modalService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to modalService on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isForUsersOrTasks).toBe('tasks');
    expect(component.isForDetailOrForm).toBe('form');
  });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });

  it('should call modalService.close when close is called', () => {
    component.close();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('should display User Detail when isForUsersOrTasks is users and isForDetailOrForm is detail', () => {
    isForUsersOrTasksSubject.next('users');
    isForDetailOrFormSubject.next('detail');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('h3').textContent.trim();
    expect(title).toBe('User Detail');
  });
});
