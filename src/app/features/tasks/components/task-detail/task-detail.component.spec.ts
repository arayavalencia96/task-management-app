import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ModalService } from '@shared/components/modal/modal.service';
import { TaskDetailComponent } from './task-detail.component';
import { selectTaskById } from '@tasks/store/task.selectors';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let store: MockStore;
  let modalService: jasmine.SpyObj<ModalService>;
  let idSubject: BehaviorSubject<string>;

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
    modalService = jasmine.createSpyObj('ModalService', ['id$', 'setID']);
    idSubject = new BehaviorSubject<string>('1');
    modalService.id$ = idSubject.asObservable();
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent, CommonModule],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectTaskById('1'), value: mockTask }],
        }),
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectTaskById('1'), mockTask);
    fixture = TestBed.createComponent(TaskDetailComponent);
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

  it('should call handleTaskSelection() correctly', () => {
    const handleTaskSelectionSpy = spyOn(component, 'handleTaskSelection');
    component.ngOnInit();
    expect(handleTaskSelectionSpy).toHaveBeenCalled();
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
    component.task = mockTask;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h2').textContent)?.toContain('Test Task');
    expect(
      compiled.querySelector('[data-testid="task-description"]').textContent
    ).toContain('Test Description');
    expect(
      compiled.querySelector('[data-testid="task-deadline"]').textContent
    ).toContain('2024-12-31');
    expect(
      compiled.querySelector('[data-testid="task-status"]').textContent
    ).toContain('Pending');
  });
});
