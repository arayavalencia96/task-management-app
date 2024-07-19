import {
  selectAllTasks,
  selectCompletedTasks,
  selectTaskById,
  selectTaskId,
  selectUserForTask,
} from './task.selectors';
import { TaskState } from '@tasks/models/task.interface';
import { User } from '@users/models/user.interface';

describe('Task Selectors', () => {
  const initialState: TaskState = {
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        description: 'Task 1 Description',
        isCompleted: false,
        userID: '1',
        deadline: '',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Task 2 Description',
        isCompleted: true,
        userID: '2',
        deadline: '',
        createdAt: new Date(),
      },
    ],
  };

  const users: User[] = [
    { id: '1', name: 'User 1', username: 'username1', email: 'username1@example.com' },
    { id: '2', name: 'User 2', username: 'username2', email: 'username2@example.com' },
  ];

  it('should select all tasks', () => {
    const result = selectAllTasks.projector(initialState);
    expect(result).toEqual(initialState.tasks);
  });

  it('should select all completed tasks', () => {
    const result = selectCompletedTasks.projector(initialState.tasks);
    expect(result).toEqual([initialState.tasks[1]]);
  });

  it('should select task by id', () => {
    const taskId = '1';
    const result = selectTaskById(taskId).projector(initialState.tasks);
    expect(result).toEqual(initialState.tasks[0]);
  });

  it('should select task id', () => {
    const result = selectTaskId('1');
    expect(result).toEqual('1');
  });

  it('should select user for task', () => {
    const taskId = '1';
    const result = selectUserForTask(taskId).projector(
      initialState.tasks,
      users
    );
    expect(result).toEqual(users[0]);
  });

  it('should return null if no user is found for task', () => {
    const taskId = '3';
    const result = selectUserForTask(taskId).projector(
      initialState.tasks,
      users
    );
    expect(result).toBeNull();
  });
});
