export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoDto {
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
}
