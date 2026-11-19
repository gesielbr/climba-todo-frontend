import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-card.html',
  styleUrls: ['./todo-card.css'],
})
export class TodoCardComponent {
  todo = input.required<Todo>();
  isActive = input<boolean>(false);
  onToggle = output<string>();
  onDelete = output<string>();
  onEdit = output<{ id: string; title: string; description?: string; dueDate?: string }>();

  isEditing = signal(false);
  editTitle = signal('');
  editDescription = signal('');
  editDueDate = signal('');
  editDateError = signal<string | null>(null);

  startEdit() {
    this.editTitle.set(this.todo().title);
    this.editDescription.set(this.todo().description ?? '');
    const d = this.todo().dueDate;
    this.editDueDate.set(d ? d.substring(0, 10) : '');
    this.editDateError.set(null);
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editDateError.set(null);
  }

  saveEdit() {
    const title = this.editTitle().trim();
    if (!title) return;

    const dateStr = this.editDueDate();
    let dueDate: string | undefined;

    this.editDateError.set(null); // limpa erro anterior

    if (dateStr) {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) {
        this.editDateError.set('Data inválida.');
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const escolhida = new Date(parsed);
      escolhida.setHours(0, 0, 0, 0);

      if (escolhida < hoje) {
        this.editDateError.set('A data não pode ser no passado.');
        return;
      }

      dueDate = parsed.toISOString();
    }

    this.onEdit.emit({
      id: this.todo().id,
      title,
      description: this.editDescription().trim() || undefined,
      dueDate,
    });
    this.isEditing.set(false);
  }

  iconFor(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('wake') || t.includes('acordar')) return '⏰';
    if (t.includes('run') || t.includes('correr')) return '🏃';
    if (t.includes('workout') || t.includes('treino')) return '🏋️';
    if (t.includes('work') || t.includes('trabalho')) return '💼';
    return '📝';
  }
}
