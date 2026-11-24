import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { DatePickerDropdown } from '../date-picker-dropdown/date-picker-dropdown';

// ╔══════════════════════════════════════════════════════════════╗
// ║  2️⃣  AQUI — o bloco que você colou vai EXATAMENTE nesta região ║
// ╚══════════════════════════════════════════════════════════════╝

/** `required` ignorando strings feitas só de espaços (mesma regra do TodoCard). */
function requiredTrimmed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim() ? null : { required: true };
}

/** `maxLength` contando após trim, preservando a chave `maxlength` usada no template. */
function maxLengthTrimmed(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const actualLength = String(control.value ?? '').trim().length;

    return actualLength > max ? { maxlength: { requiredLength: max, actualLength } } : null;
  };
}

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

    // new Date() normaliza overflow (31/02 → 03/03). isNaN() sozinho não pegava.
    // Mesmo `ehValida` do parseValidDate do TodoCard.
    const ehValida =
      !isNaN(escolhida.getTime()) &&
      escolhida.getFullYear() === ano &&
      escolhida.getMonth() === mes &&
      escolhida.getDate() === dia;

    if (!ehValida) {
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

// ╔══════════════════════════════════════════════════════════════╗
// ║  3️⃣  @Component                                                ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerDropdown],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css'],
})
// ╔══════════════════════════════════════════════════════════════╗
// ║  4️⃣  classe — as funções NÃO entram aqui                       ║
// ╚══════════════════════════════════════════════════════════════╝
export class CreateTask {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);

  formFocused = output<void>();

  taskForm = this.fb.group({
    title: ['', [requiredTrimmed(), maxLengthTrimmed(150)]], // 👈 chama as funções
    description: ['', [maxLengthTrimmed(1000)]], // 👈
    dueDate: ['', [dataNaoPassadaValidator()]], // 👈
  });

  get isTitleInvalid(): boolean {
    const c = this.taskForm.get('title');
    return !!c?.invalid && (c.touched || c.dirty);
  }

  get isDescriptionInvalid(): boolean {
    const c = this.taskForm.get('description');
    return !!c?.invalid && (c.touched || c.dirty);
  }

  get isDueDateInvalid(): boolean {
    const c = this.taskForm.get('dueDate');
    return !!c?.invalid && (c.touched || c.dirty);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const { title, description, dueDate } = this.taskForm.value;

      const titulo = (title ?? '').trim();
      if (!titulo) return;

      let dueDateIso: string | undefined;
      if (dueDate) {
        dueDateIso = new Date(dueDate).toISOString();
      }

      this.todoService
        .createTodo({
          title: titulo,
          description: (description ?? '').trim() || undefined,
          dueDate: dueDateIso,
        })
        .subscribe({
          next: () => this.taskForm.reset({ title: '', description: '', dueDate: '' }),
          error: (err) => console.error('Erro ao criar', err),
        });
    }
  }
}
