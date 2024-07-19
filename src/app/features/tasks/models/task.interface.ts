export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userID?: string;
}

export interface TaskState {
  tasks: Task[];
}
