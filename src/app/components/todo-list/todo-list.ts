import { Component, inject, OnInit, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { TodoCardComponent } from '../todo-card/todo-card';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoCardComponent, CapitalizePipe],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css'],
})
export class TodoList implements OnInit {
  todoService = inject(TodoService);

  searchTerm = input<string>('');
  searchTermChange = output<string>();

  hoje = new Date();

  filteredTodos = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.todoService.todos();

    return this.todoService.todos().filter((t) => {
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
        dateStr.toLowerCase().includes(term) ||
        dateIso.includes(term)
      );
    });
  });

  ngOnInit() {
    this.todoService.loadTodos();
  }

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
