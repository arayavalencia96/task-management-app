import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { ShowSectionService } from '@core/services/show-section.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let showSelectionService: jasmine.SpyObj<ShowSectionService>;
  let idSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    showSelectionService = jasmine.createSpyObj('ShowSelectionService', [
      'showUsersOrTasks$',
      'setShowUsersOrTasks',
    ]);
    idSubject = new BehaviorSubject<string>('users');
    showSelectionService.showUsersOrTasks$ = idSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: showSelectionService, useValue: showSelectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showSection() correctly', () => {
    component.showSection('');
    expect(showSelectionService.setIsForUsersOrTasks).toHaveBeenCalled();
  });
});
