import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://climba-todo.vercel.app/api/todos';

  private todosSignal = signal<Todo[]>([]);
  public todos = this.todosSignal.asReadonly();

  private loadingSignal = signal<boolean>(false);
  public loading = this.loadingSignal.asReadonly();

  loadTodos(): void {
    this.loadingSignal.set(true);
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.todosSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas', err);
        this.loadingSignal.set(false);
      },
    });
  }

  createTodo(dto: CreateTodoDto): Observable<void> {
    return this.http.post(this.apiUrl, dto, { responseType: 'text' }).pipe(
      tap(() => this.loadTodos()),
      map(() => void 0),
    );
  }

  completeTodo(id: string): Observable<void> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {}, { responseType: 'text' }).pipe(
      tap(() => this.loadTodos()),
      map(() => void 0),
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() => {
        this.todosSignal.update((todos) => todos.filter((t) => t.id !== id));
      }),
      map(() => void 0),
    );
  }

  updateTodo(id: string, dto: UpdateTodoDto): Observable<void> {
    return this.http.put(`${this.apiUrl}/${id}`, dto, { responseType: 'text' }).pipe(
      tap(() => {
        // Atualiza o signal diretamente com os novos dados
        this.todosSignal.update((todos) =>
          todos.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title: dto.title,
                  description: dto.description,
                  dueDate: dto.dueDate ?? t.dueDate,
                  isCompleted: dto.isCompleted ?? t.isCompleted,
                }
              : t,
          ),
        );
      }),
      map(() => void 0),
    );
  }
}
