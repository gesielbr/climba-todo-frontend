import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
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
    '[class.completed]': 'todo().isCompleted',
    '[class.editing-card]': 'isEditing()',
    '[class.calendar-open-card]': 'isEditing() && isCalendarOpen()',
  },
})
export class TodoCardComponent implements AfterViewInit {
  // ════════════════════════════════════════════════════════════
  // 1. INPUTS E OUTPUTS
  // ════════════════════════════════════════════════════════════

  /** Tarefa exibida no card */
  todo = input.required<Todo>();

  /** Card está ativo (selecionado/em foco na lista) */
  isActive = input<boolean>(false);

  /** Marcar/desmarcar como concluída */
  onToggle = output<string>();

  /** Excluir a tarefa */
  onDelete = output<string>();

  /** Salvar a edição (título, descrição e prazo) */
  onEdit = output<{
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
  }>();

  // ════════════════════════════════════════════════════════════
  // 2. ESTADO — EXPANSÃO DE TEXTO (título e descrição)
  // ════════════════════════════════════════════════════════════

  /** Referência ao <h6> do título (só existe em modo leitura) */
  readonly titleEl = viewChild<ElementRef<HTMLElement>>('titleEl');

  /** Referência ao <p> da descrição (só existe em modo leitura) */
  readonly descEl = viewChild<ElementRef<HTMLParagraphElement>>('descEl');

  /** Referência ao <textarea> do título (só existe em modo edição) */
  readonly editTitleEl = viewChild<ElementRef<HTMLTextAreaElement>>('editTitleEl');

  /** Referência ao <textarea> da descrição (só existe em modo edição) */
  readonly editDescEl = viewChild<ElementRef<HTMLTextAreaElement>>('editDescEl');

  /** Título em leitura: expandido? / estourou 3 linhas? */
  readonly isTitleExpanded = signal(false);
  readonly showTitleExpand = signal(false);

  /** Descrição em leitura: expandida? / estourou 5 linhas? */
  readonly isDescriptionExpanded = signal(false);
  readonly showExpandButton = signal(false);

  /** Título em edição: expandido? / estourou 3 linhas? */
  readonly isEditTitleExpanded = signal(false);
  readonly showEditTitleExpand = signal(false);

  /** Descrição em edição: expandida? / estourou 5 linhas? */
  readonly isEditDescriptionExpanded = signal(false);
  readonly showEditDescExpand = signal(false);

  // ════════════════════════════════════════════════════════════
  // 3. ESTADO — MODO DE EDIÇÃO
  // ════════════════════════════════════════════════════════════

  isEditing = signal(false);
  isCalendarOpen = signal(false);

  editTitle = signal('');
  editDescription = signal('');
  editDueDate = signal('');

  editTitleError = signal<string | null>(null);
  editDescriptionError = signal<string | null>(null);
  editDateError = signal<string | null>(null);

  // ════════════════════════════════════════════════════════════
  // 4. LIFECYCLE
  // ════════════════════════════════════════════════════════════

  constructor() {
    // quando a tarefa muda, entra/sai do modo edição ou os elementos
    // de texto entram/saem do DOM, reavalia quem precisa do botão
    effect(() => {
      this.todo();
      this.isEditing();
      this.titleEl();
      this.descEl();
      this.editTitleEl();
      this.editDescEl();
      setTimeout(() => this.updateExpandChecks());
    });
  }

  ngAfterViewInit(): void {
    this.updateExpandChecks();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // largura mudou → os textos podem passar (ou não) a caber nas linhas
    this.updateExpandChecks();
  }

  // ════════════════════════════════════════════════════════════
  // 5. EXPANSÃO DE TEXTO (usado no template)
  // ════════════════════════════════════════════════════════════

  toggleTitleExpand(): void {
    this.isTitleExpanded.update((v) => !v);
    setTimeout(() => this.checkTitleOverflow());
  }

  toggleDescription(): void {
    this.isDescriptionExpanded.update((v) => !v);
    setTimeout(() => this.checkDescriptionOverflow());
  }

  toggleEditTitle(): void {
    const next = !this.isEditTitleExpanded();
    this.isEditTitleExpanded.set(next);

    setTimeout(() => {
      if (next) {
        this.growEditTitle();
      } else {
        this.resetEditTitleHeight();
      }
      this.checkEditTitleOverflow();
    });
  }

  toggleEditDescription(): void {
    const next = !this.isEditDescriptionExpanded();
    this.isEditDescriptionExpanded.set(next);

    setTimeout(() => {
      if (next) {
        this.growEditDescription();
      } else {
        this.resetEditDescriptionHeight();
      }
      this.checkEditDescriptionOverflow();
    });
  }

  /** Digitação no título durante a edição (valida + expande) */
  onEditTitleInput(value: string): void {
    this.onEditTitleChange(value);

    if (this.isEditTitleExpanded()) {
      // cresce junto enquanto digita
      this.growEditTitle();
    } else {
      // o texto pode passar (ou deixar de passar) de 3 linhas ao digitar
      setTimeout(() => this.checkEditTitleOverflow());
    }
  }

  /** Digitação na descrição durante a edição (valida + expande) */
  onEditDescriptionInput(value: string): void {
    this.onEditDescriptionChange(value); // valida ANTES de medir

    if (this.isEditDescriptionExpanded()) {
      // cresce junto enquanto digita
      this.growEditDescription();
    } else {
      // setTimeout: a classe .is-invalid (e seu padding-right: 3rem) já foi
      // renderizada antes de lermos scrollHeight → "Ver mais" não desatualiza
      setTimeout(() => this.checkEditDescriptionOverflow());
    }
  }

  // ════════════════════════════════════════════════════════════
  // 6. EDIÇÃO — ABRIR / CANCELAR / SALVAR
  // ════════════════════════════════════════════════════════════

  startEdit(): void {
    this.editTitle.set(this.todo().title);
    this.editDescription.set(this.todo().description ?? '');

    const d = this.todo().dueDate;
    this.editDueDate.set(d ? d.substring(0, 10) : '');

    this.editTitleError.set(null);
    this.editDescriptionError.set(null);
    this.editDateError.set(null);
    this.isCalendarOpen.set(false);
    this.isEditing.set(true);

    // os elementos vão entrar no DOM → reseta os estados de expansão
    this.isTitleExpanded.set(false);
    this.isDescriptionExpanded.set(false);
    this.isEditTitleExpanded.set(false);
    this.isEditDescriptionExpanded.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.isCalendarOpen.set(false);
    this.editTitleError.set(null);
    this.editDescriptionError.set(null);
    this.editDateError.set(null);

    this.isTitleExpanded.set(false);
    this.isDescriptionExpanded.set(false);
    this.isEditTitleExpanded.set(false);
    this.isEditDescriptionExpanded.set(false);
  }

  saveEdit(): void {
    const title = this.editTitle().trim();
    if (!title) return;

    const description = this.editDescription().trim();
    if (description.length > 1000) {
      // rede de segurança: o sinal já é setado no input, mas protege
      // chamadas diretas / setValue externo
      this.editDescriptionError.set('Descrição deve ter no máximo 1000 caracteres.');
      return;
    }

    const dateStr = this.editDueDate();
    let dueDate: string | undefined;

    if (dateStr) {
      const escolhida = this.parseValidDate(dateStr);

      if (!escolhida) {
        this.editDateError.set('Data inválida.');
        return;
      }

      if (this.isDateInPast(escolhida)) {
        this.editDateError.set('A data não pode ser no passado.');
        return;
      }

      dueDate = escolhida.toISOString();
    }

    this.onEdit.emit({
      id: this.todo().id,
      title,
      description: description || undefined,
      dueDate,
    });

    this.isCalendarOpen.set(false);
    this.isEditing.set(false);
  }

  // ════════════════════════════════════════════════════════════
  // 7. HANDLERS DO TEMPLATE
  // ════════════════════════════════════════════════════════════

  /** Calendário abriu/fechou (usado pelo host binding calendar-open-card) */
  onCalendarOpenChange(isOpen: boolean): void {
    this.isCalendarOpen.set(isOpen);
  }

  /** Digitação no campo de data */
  onEditDueDateChange(value: string): void {
    this.editDueDate.set(value);
    this.editDateError.set(null);

    if (!value) return;

    const escolhida = this.parseValidDate(value);
    if (!escolhida) {
      this.editDateError.set('Data inválida.');
      return;
    }

    if (this.isDateInPast(escolhida)) {
      this.editDateError.set('A data não pode ser no passado.');
    }
  }

  /** Validação do título (chamado pelo onEditTitleInput) */
  onEditTitleChange(value: string): void {
    this.editTitle.set(value);

    const title = value.trim();

    if (!title) {
      this.editTitleError.set('Título é obrigatório.');
      return;
    }

    if (title.length > 150) {
      this.editTitleError.set('Título deve ter no máximo 150 caracteres.');
      return;
    }

    this.editTitleError.set(null);
  }

  /** Validação da descrição (chamado pelo onEditDescriptionInput) */
  onEditDescriptionChange(value: string): void {
    this.editDescription.set(value);

    // mesmo critério do título e do saveEdit(): conta após trim
    if (value.trim().length > 1000) {
      this.editDescriptionError.set('Descrição deve ter no máximo 1000 caracteres.');
      return;
    }

    this.editDescriptionError.set(null);
  }

  // ════════════════════════════════════════════════════════════
  // 8. HELPERS PRIVADOS
  // ════════════════════════════════════════════════════════════

  /**
   * Valida e converte uma string "yyyy-MM-dd" em Date.
   * Retorna null se a data não existir (ex: 31/02) ou o formato for inválido.
   */
  private parseValidDate(value: string): Date | null {
    const parts = value.split('-');

    if (parts.length !== 3) return null;

    const ano = Number(parts[0]);
    const mes = Number(parts[1]) - 1;
    const dia = Number(parts[2]);

    const escolhida = new Date(ano, mes, dia);

    const ehValida =
      !isNaN(escolhida.getTime()) &&
      escolhida.getFullYear() === ano &&
      escolhida.getMonth() === mes &&
      escolhida.getDate() === dia;

    return ehValida ? escolhida : null;
  }

  /** Compara apenas a parte da data (ignora hora) */
  private isDateInPast(date: Date): boolean {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return date < hoje;
  }

  /** Roda todas as verificações de overflow de uma vez */
  private updateExpandChecks(): void {
    this.checkTitleOverflow();
    this.checkDescriptionOverflow();
    this.checkEditTitleOverflow();
    this.checkEditDescriptionOverflow();
  }

  /** Título (leitura): o texto foi cortado pelo clamp de 3 linhas? */
  private checkTitleOverflow(): void {
    const el = this.titleEl()?.nativeElement;

    if (!el) {
      this.showTitleExpand.set(false);
      return;
    }

    if (this.isTitleExpanded()) {
      this.showTitleExpand.set(true);
      return;
    }

    this.showTitleExpand.set(el.scrollHeight > el.clientHeight + 1);
  }

  /** Descrição (leitura): o texto foi cortado pelo clamp de 5 linhas? */
  private checkDescriptionOverflow(): void {
    const el = this.descEl()?.nativeElement;

    if (!el) {
      this.showExpandButton.set(false);
      return;
    }

    if (this.isDescriptionExpanded()) {
      this.showExpandButton.set(true);
      return;
    }

    this.showExpandButton.set(el.scrollHeight > el.clientHeight + 1);
  }

  /** Título (edição): o textarea com 3 linhas está com texto escondido? */
  private checkEditTitleOverflow(): void {
    const el = this.editTitleEl()?.nativeElement;

    if (!el) {
      this.showEditTitleExpand.set(false);
      return;
    }

    if (this.isEditTitleExpanded()) {
      this.showEditTitleExpand.set(true);
      return;
    }

    this.showEditTitleExpand.set(el.scrollHeight > el.clientHeight + 1);
  }

  /** Descrição (edição): o textarea com 5 linhas está com texto escondido? */
  private checkEditDescriptionOverflow(): void {
    const el = this.editDescEl()?.nativeElement;

    if (!el) {
      this.showEditDescExpand.set(false);
      return;
    }

    if (this.isEditDescriptionExpanded()) {
      this.showEditDescExpand.set(true);
      return;
    }

    this.showEditDescExpand.set(el.scrollHeight > el.clientHeight + 1);
  }

  /** Expande o textarea do título até caber todo o texto */
  private growEditTitle(): void {
    const el = this.editTitleEl()?.nativeElement;
    if (!el) return;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  /** Volta o textarea do título para as 3 linhas fixas */
  private resetEditTitleHeight(): void {
    const el = this.editTitleEl()?.nativeElement;
    if (el) el.style.height = '';
  }

  /** Expande o textarea da descrição até caber todo o texto */
  private growEditDescription(): void {
    const el = this.editDescEl()?.nativeElement;
    if (!el) return;

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  /** Volta o textarea da descrição para as 5 linhas fixas */
  private resetEditDescriptionHeight(): void {
    const el = this.editDescEl()?.nativeElement;
    if (el) el.style.height = '';
  }

  // ════════════════════════════════════════════════════════════
  // 9. ÍCONE DA TAREFA
  // ════════════════════════════════════════════════════════════

  /** Escolhe um emoji conforme palavras-chave no título */
  iconFor(title: string): string {
    const t = title.toLowerCase();

    if (t.includes('wake') || t.includes('acordar')) return '⏰';
    if (t.includes('run') || t.includes('correr')) return '🏃';
    if (t.includes('workout') || t.includes('treino')) return '🏋️';
    if (t.includes('work') || t.includes('trabalho')) return '💼';

    return '📝';
  }
}
