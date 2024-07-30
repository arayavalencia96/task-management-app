import { UserState } from '@users/models/user.interface';
import {
  selectAllUsers,
  selectTasksForUser,
  selectUserById,
  selectUserId,
} from './user.selectors';
import { Task } from '@tasks/models/task.interface';
import { createSelector, MemoizedSelector, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { selectAllTasks } from '@tasks/store/task.selectors';

describe('Task Selectors', () => {
  const specificDate = new Date('2024-07-29T22:32:26-03:00');
  const initialState: UserState = {
    users: [
      {
        id: '1',
        name: 'User 1',
        username: 'username1',
        email: 'username1@example.com',
        createdAt: specificDate,
      },
      {
        id: '2',
        name: 'User 2',
        username: 'username2',
        email: 'username2@example.com',
        createdAt: specificDate,
      },
    ],
  };

  const initialTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      isCompleted: false,
      userID: '1',
      description: '',
      deadline: '',
      createdAt: specificDate,
    },
    {
      id: '2',
      title: 'Task 2',
      isCompleted: true,
      userID: '2',
      description: '',
      deadline: '',
      createdAt: specificDate,
    },
    {
      id: '3',
      title: 'Task 3',
      isCompleted: false,
      userID: '1',
      description: '',
      deadline: '',
      createdAt: specificDate,
    },
  ];

  let selectTasksForUserSelector: MemoizedSelector<object, Task[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
    });

    selectTasksForUserSelector = createSelector(
      selectAllTasks,
      (tasks: Task[]) => selectTasksForUser('1').projector(tasks)
    );
  });

  it('should select all users', () => {
    const result = selectAllUsers.projector(initialState);
    expect(result).toEqual(initialState.users);
  });

  it('should select user by id', () => {
    const taskId = '1';
    const result = selectUserById(taskId).projector(initialState.users);
    expect(result).toEqual(initialState.users[0]);
  });

  it('should select user id', () => {
    const result = selectUserId('1');
    expect(result).toEqual('1');
  });

  it('should select tasks for the given user', () => {
    const result = selectTasksForUserSelector?.projector(initialTasks);
    expect(result?.length).toBe(2);
    expect(result).toEqual([
      {
        id: '1',
        title: 'Task 1',
        isCompleted: false,
        userID: '1',
        description: '',
        deadline: '',
        createdAt: specificDate,
      },
      {
        id: '3',
        title: 'Task 3',
        isCompleted: false,
        userID: '1',
        description: '',
        deadline: '',
        createdAt: specificDate,
      },
    ]);
  });

  it('should return an empty array if no tasks are found for the given user', () => {
    const result = selectTasksForUserSelector?.projector(
      initialTasks?.filter(task => task?.userID === '3')
    );
    expect(result?.length).toBe(0);
    expect(result).toEqual([]);
  });
});
