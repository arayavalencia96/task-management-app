import { TaskState } from '@tasks/models/task.interface';
import { UserState } from '@users/models/user.interface';
import { PaginationState } from '@core/store/pagination/pagination.interface';

export interface AppState {
  tasks: TaskState;
  users: UserState;
  pagination: PaginationState;
}
