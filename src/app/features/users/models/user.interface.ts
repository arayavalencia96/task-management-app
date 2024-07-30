import { Task } from '@tasks/models/task.interface';

export interface User {
  createdAt: Date;
  email: string;
  id: string;
  name: string;
  tasks?: Task[];
  updatedAt?: Date;
  username: string;
}

export interface UserState {
  users: User[];
}
