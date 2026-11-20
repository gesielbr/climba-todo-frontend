import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { DatePickerDropdown } from '../../date-picker-dropdown/date-picker-dropdown';

function dataNaoPassadaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    // O input date retorna "yyyy-MM-dd". Extraímos dia, mês e ano.
    const parts = String(control.value).split('-');
    if (parts.length !== 3) {
      return { dataInvalida: true };
    }

    const ano = Number(parts[0]);
    const mes = Number(parts[1]) - 1; // mês começa em 0
    const dia = Number(parts[2]);

    const escolhida = new Date(ano, mes, dia); // data local, sem UTC
    if (isNaN(escolhida.getTime())) {
      return { dataInvalida: true };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (escolhida < hoje) {
      return { dataPassada: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerDropdown],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css'],
})
export class CreateTask {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  formFocused = output<void>(); // 👈 NOVO

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    dueDate: ['', [dataNaoPassadaValidator()]],
  });

  onSubmit() {
    if (this.taskForm.valid) {
      const { title, description, dueDate } = this.taskForm.value;

      let dueDateIso: string | undefined;
      if (dueDate) {
        dueDateIso = new Date(dueDate).toISOString();
      }

      this.todoService
        .createTodo({
          title: title!,
          description: description || undefined,
          dueDate: dueDateIso,
        })
        .subscribe({
          next: () => this.taskForm.reset(),
          error: (err) => console.error('Erro ao criar', err),
        });
    }
  }

  get isDueDateInvalid(): boolean {
    const dueDateControl = this.taskForm.get('dueDate');
    if (!dueDateControl) return false;
    return Boolean(dueDateControl.invalid && (dueDateControl.touched || dueDateControl.dirty));
  }
}
