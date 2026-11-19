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

function dataNaoPassadaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const parsed = new Date(control.value);
    if (isNaN(parsed.getTime())) {
      return { dataInvalida: true };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const escolhida = new Date(parsed);
    escolhida.setHours(0, 0, 0, 0);

    if (escolhida < hoje) {
      return { dataPassada: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
}
