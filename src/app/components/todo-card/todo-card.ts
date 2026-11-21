import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { DatePickerDropdown } from '../../date-picker-dropdown/date-picker-dropdown';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerDropdown],
  templateUrl: './todo-card.html',
  styleUrls: ['./todo-card.css'],
  host: {
    '[class.editing-card]': 'isEditing()',
    '[class.calendar-open-card]': 'isEditing() && isCalendarOpen()',
  },
})
export class TodoCardComponent {
  // ==========================================
  // 1. INPUTS E OUTPUTS
  // ==========================================
  todo = input.required<Todo>();
  isActive = input<boolean>(false);

  onToggle = output<string>();
  onDelete = output<string>();

  onEdit = output<{
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
  }>();

  // ==========================================
  // 2. ESTADOS E CAMPOS DE EDIÇÃO
  // ==========================================
  isEditing = signal(false);
  isCalendarOpen = signal(false);

  editTitle = signal('');
  editDescription = signal('');
  editDueDate = signal('');
  editDateError = signal<string | null>(null);

  // ==========================================
  // 3. CONTROLE DA EDIÇÃO
  // ==========================================
  startEdit(): void {
    this.editTitle.set(this.todo().title);
    this.editDescription.set(this.todo().description ?? '');

    const d = this.todo().dueDate;
    this.editDueDate.set(d ? d.substring(0, 10) : '');

    this.editDateError.set(null);
    this.isCalendarOpen.set(false);
    this.isEditing.set(true);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.isCalendarOpen.set(false);
    this.editDateError.set(null);
  }

  // ==========================================
  // 4. CONTROLE DO CALENDÁRIO
  // ==========================================
  onCalendarOpenChange(isOpen: boolean): void {
    this.isCalendarOpen.set(isOpen);
  }

  // ==========================================
  // 5. SALVAMENTO DA EDIÇÃO
  // ==========================================
  saveEdit(): void {
    const title = this.editTitle().trim();

    if (!title) return;

    const dateStr = this.editDueDate();
    let dueDate: string | undefined;

    this.editDateError.set(null);

    if (dateStr) {
      // Extrai ano, mês e dia da string yyyy-MM-dd
      const parts = dateStr.split('-');

      if (parts.length !== 3) {
        this.editDateError.set('Data inválida.');
        return;
      }

      const ano = Number(parts[0]);
      const mes = Number(parts[1]) - 1;
      const dia = Number(parts[2]);

      const escolhida = new Date(ano, mes, dia);

      if (
        isNaN(escolhida.getTime()) ||
        escolhida.getFullYear() !== ano ||
        escolhida.getMonth() !== mes ||
        escolhida.getDate() !== dia
      ) {
        this.editDateError.set('Data inválida.');
        return;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (escolhida < hoje) {
        this.editDateError.set('A data não pode ser no passado.');
        return;
      }

      dueDate = escolhida.toISOString();
    }

    this.onEdit.emit({
      id: this.todo().id,
      title,
      description: this.editDescription().trim() || undefined,
      dueDate,
    });

    this.isCalendarOpen.set(false);
    this.isEditing.set(false);
  }

  // ==========================================
  // 6. IDENTIFICAÇÃO DO ÍCONE DA TAREFA
  // ==========================================
  iconFor(title: string): string {
    const t = title.toLowerCase();

    if (t.includes('wake') || t.includes('acordar')) return '⏰';
    if (t.includes('run') || t.includes('correr')) return '🏃';
    if (t.includes('workout') || t.includes('treino')) return '🏋️';
    if (t.includes('work') || t.includes('trabalho')) return '💼';

    return '📝';
  }
}
