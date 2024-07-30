import { v4 as uuidv4 } from 'uuid';

import { TaskState } from '@tasks/models/task.interface';
import { UserState } from '@users/models/user.interface';
import { PaginationState } from '@core/store/pagination/pagination.interface';

export const initialStateTasks: TaskState = {
  tasks: [
    {
      id: uuidv4(),
      title: 'Task 1',
      deadline: '11-07-2024',
      description: 'Task 1',
      isCompleted: true,
      createdAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Task 2',
      deadline: '11-08-2024',
      description: 'Task 2',
      isCompleted: false,
      createdAt: new Date(),
    },
  ],
};

export const initialStateUsers: UserState = {
  users: [
    {
      id: uuidv4(),
      name: 'Axel',
      email: 'axel@gmail.com',
      username: 'axelaraya',
      createdAt: new Date(),
    },
  ],
};

export const initialStatePagination: PaginationState = {
  currentPage: 1,
  itemsPerPage: 4,
};
