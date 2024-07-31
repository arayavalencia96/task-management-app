import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSectionService } from '@core/services/show-section.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let showSectionService: jasmine.SpyObj<ShowSectionService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ShowSectionService', [
      'setIsForUsersOrTasks',
    ]);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: ShowSectionService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    showSectionService = TestBed.inject(
      ShowSectionService
    ) as jasmine.SpyObj<ShowSectionService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setIsForUsersOrTasks on showSectionService when showSection is called', () => {
    const section = 'tasks';
    component.showSection(section);
    expect(showSectionService.setIsForUsersOrTasks).toHaveBeenCalledWith(
      section
    );
  });
});
