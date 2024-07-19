import { Task } from '@tasks/models/task.interface';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  tasks?: Task[];
}

export interface UserState {
  users: User[];
}
