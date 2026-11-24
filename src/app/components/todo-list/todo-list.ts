import { Component, inject, OnInit, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoCardComponent } from '../todo-card/todo-card';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoCardComponent],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css'],
})
export class TodoList implements OnInit {
  // ───────── Injeções ─────────
  todoService = inject(TodoService);
  userService = inject(UserService);

  // ───────── Inputs / Outputs ─────────
  searchTerm = input<string>('');
  searchTermChange = output<string>();

  // ───────── Estado ─────────
  hoje = new Date();

  // ───────── Computeds ─────────
  hojeFormatada = computed(() => {
    const texto = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(this.hoje);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  });

  greetingInitial = computed(() => {
    const n = this.userService.name().trim();
    return n ? Array.from(n)[0].toUpperCase() : '';
  });

  filteredTodos = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const todos = this.todoService.todos();

    const filtrados = !term
      ? todos
      : todos.filter((t) => {
          const title = String(t.title).toLowerCase();
          const desc = String(t.description ?? '').toLowerCase();

          let dateStr = '';
          if (t.dueDate) {
            const d = new Date(t.dueDate);
            if (!isNaN(d.getTime())) {
              const day = String(d.getUTCDate()).padStart(2, '0');
              const month = String(d.getUTCMonth() + 1).padStart(2, '0');
              const year = d.getUTCFullYear();
              dateStr = `${day}/${month}/${year}`;
            }
          }

          const dateIso = String(t.dueDate ?? '').toLowerCase();
          return (
            title.includes(term) ||
            desc.includes(term) ||
            dateStr.includes(term) ||
            dateIso.includes(term)
          );
        });

    // Vencimento mais próximo primeiro (sem data vai pro fim)
    return [...filtrados].sort((a, b) => {
      // Primeiro: pendentes (0) antes das concluídas (1).
      const statusA = a.isCompleted ? 1 : 0;
      const statusB = b.isCompleted ? 1 : 0;

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Dentro de cada grupo, ordena pela data de vencimento.
      const dataA = this.dueTime(a.dueDate);
      const dataB = this.dueTime(b.dueDate);

      if (dataA === dataB) return 0;

      return dataA < dataB ? -1 : 1;
    });
  });

  // ───────── Helpers privados ─────────
  /** Timestamp da dueDate, ou Infinity (vai pro fim) se vazia/inválida. */
  private dueTime(dueDate?: string | null): number {
    if (!dueDate) return Infinity;
    const t = new Date(dueDate).getTime();
    return isNaN(t) ? Infinity : t;
  }

  // ───────── Ciclo de vida ─────────
  ngOnInit() {
    this.todoService.loadTodos();
  }

  // ───────── Handlers ─────────
  onSearchInput(value: string) {
    this.searchTermChange.emit(value);
  }

  toggleTodo(id: string) {
    const todo = this.todoService.todos().find((t) => t.id === id);
    if (!todo) return;

    this.todoService
      .updateTodo(id, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        isCompleted: !todo.isCompleted,
      })
      .subscribe();
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe();
  }

  editTodo(event: { id: string; title: string; description?: string; dueDate?: string }) {
    this.todoService
      .updateTodo(event.id, {
        title: event.title,
        description: event.description,
        dueDate: event.dueDate,
      })
      .subscribe();
  }
}
