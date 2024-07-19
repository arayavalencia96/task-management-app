import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and isVisible$ should be true', (done) => {
    service.open();
    service.isVisible$.subscribe((isVisible) => {
      expect(isVisible).toBe(true);
      done();
    });
  });

  it('should set and isForUsersOrTasks$ should equal to tasks', (done) => {
    service.setIsForUsersOrTasks('tasks');
    service.isForUsersOrTasks$.subscribe((feature) => {
      expect(feature).toBe('tasks');
      done();
    });
  });

  it('should set and isForCreateOrUpdate$ should equal to create', (done) => {
    service.setIsForCreateOrUpdate('create');
    service.isForCreateOrUpdate$.subscribe((action) => {
      expect(action).toBe('create');
      done();
    });
  });

  it('should set and isForDetailOrForm$ should equal to form', (done) => {
    service.setIsForDetailOrForm('form');
    service.isForDetailOrForm$.subscribe((component) => {
      expect(component).toBe('form');
      done();
    });
  });

  it('should set and id$ should equal to 123', (done) => {
    service.setID('123');
    service.id$.subscribe((id) => {
      expect(id).toBe('123');
      done();
    });
  });

  it('should close modal', (done) => {
    service.open();
    service.close();
    service.isVisible$.subscribe((isVisible) => {
      expect(isVisible).toBe(false);
      done();
    });
  });
});
