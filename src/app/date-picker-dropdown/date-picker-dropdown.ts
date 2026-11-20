import {
  Component,
  ElementRef,
  HostListener,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  imports: [CommonModule],
  selector: 'app-date-picker-dropdown',
  styleUrl: './date-picker-dropdown.css',
  templateUrl: './date-picker-dropdown.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerDropdown),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerDropdown),
      multi: true,
    },
  ],
})
export class DatePickerDropdown implements ControlValueAccessor, Validator {
  // ==========================================
  // 1. DEPENDÊNCIAS E REFERÊNCIAS DE DOM
  // ==========================================
  private readonly elementRefDropdown = inject(ElementRef<HTMLElement>);
  private readonly inputDropdownRef = viewChild<ElementRef<HTMLInputElement>>('inputDropdownRef');

  // ==========================================
  // 2. SIGNALS E ESTADOS DERIVADOS (COMPUTED)
  // ==========================================
  displayValueDropdown = signal('');
  isOpenDropdown = signal(false);
  currentMonthDropdown = signal(new Date());
  selectedDateDropdown = signal<Date | null>(null);
  isInvalidDropdown = input<boolean>(false);
  validationErrorDropdown = signal<ValidationErrors | null>(null);

  hasTypedErrorDropdown = computed(() => {
    const rawDropdown = this.displayValueDropdown().trim();
    return rawDropdown.length > 0 && this.validationErrorDropdown() !== null;
  });

  monthLabelDropdown = computed(() => {
    const mesesDropdown = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const dateDropdown = this.currentMonthDropdown();
    return `${mesesDropdown[dateDropdown.getMonth()]} ${dateDropdown.getFullYear()}`;
  });

  calendarDaysDropdown = computed(() => {
    const baseDropdown = this.currentMonthDropdown();
    const yearDropdown = baseDropdown.getFullYear();
    const monthDropdown = baseDropdown.getMonth();
    const firstDayDropdown = new Date(yearDropdown, monthDropdown, 1);
    const lastDayDropdown = new Date(yearDropdown, monthDropdown + 1, 0);
    const totalDaysDropdown = lastDayDropdown.getDate();
    const startWeekdayDropdown = firstDayDropdown.getDay();

    const daysDropdown: (Date | null)[] = [];
    for (let i = 0; i < startWeekdayDropdown; i++) {
      daysDropdown.push(null);
    }
    for (let d = 1; d <= totalDaysDropdown; d++) {
      daysDropdown.push(new Date(yearDropdown, monthDropdown, d));
    }
    return daysDropdown;
  });

  // ==========================================
  // 3. CONTROLE DE FOCO E DROPDOWN
  // ==========================================
  private suppressOpenOnFocusDropdown = false;

  private focusInputAfterSelectionDropdown(): void {
    this.suppressOpenOnFocusDropdown = true;
    queueMicrotask(() => {
      this.inputDropdownRef()?.nativeElement.focus();
      queueMicrotask(() => {
        this.suppressOpenOnFocusDropdown = false;
      });
    });
  }

  openDropdown(): void {
    if (this.suppressOpenOnFocusDropdown) {
      return;
    }
    if (this.selectedDateDropdown()) {
      const selectedDropdown = this.selectedDateDropdown()!;
      this.currentMonthDropdown.set(
        new Date(selectedDropdown.getFullYear(), selectedDropdown.getMonth(), 1),
      );
    }
    this.isOpenDropdown.set(true);
  }

  closeDropdown(): void {
    this.isOpenDropdown.set(false);
  }

  toggleDropdown(): void {
    if (this.isOpenDropdown()) {
      this.closeDropdown();
      return;
    }
    this.openDropdown();
  }

  onIconFocusDropdown(): void {
    if (!this.isOpenDropdown()) {
      this.openDropdown();
    }
  }

  onFocusOutDropdown(eventDropdown: FocusEvent): void {
    const nextFocusedDropdown = eventDropdown.relatedTarget as Node | null;
    if (
      !nextFocusedDropdown ||
      !this.elementRefDropdown.nativeElement.contains(nextFocusedDropdown)
    ) {
      this.onTouchedDropdown();
      this.closeDropdown();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClickDropdown(eventDropdown: MouseEvent): void {
    if (!this.isOpenDropdown()) return;
    const targetDropdown = eventDropdown.target as Node | null;
    if (targetDropdown && !this.elementRefDropdown.nativeElement.contains(targetDropdown)) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeDropdown(): void {
    if (this.isOpenDropdown()) {
      this.closeDropdown();
    }
  }

  // ==========================================
  // 4. NAVEGAÇÃO E SELEÇÃO NO CALENDÁRIO
  // ==========================================
  prevMonthDropdown(): void {
    const currentDropdown = this.currentMonthDropdown();
    this.currentMonthDropdown.set(
      new Date(currentDropdown.getFullYear(), currentDropdown.getMonth() - 1, 1),
    );
  }

  nextMonthDropdown(): void {
    const currentDropdown = this.currentMonthDropdown();
    this.currentMonthDropdown.set(
      new Date(currentDropdown.getFullYear(), currentDropdown.getMonth() + 1, 1),
    );
  }

  selectDayDropdown(dayDropdown: Date | null): void {
    if (!dayDropdown) return;

    const candidateDropdown = new Date(
      dayDropdown.getFullYear(),
      dayDropdown.getMonth(),
      dayDropdown.getDate(),
    );
    candidateDropdown.setHours(0, 0, 0, 0);

    this.selectedDateDropdown.set(candidateDropdown);
    this.currentMonthDropdown.set(
      new Date(candidateDropdown.getFullYear(), candidateDropdown.getMonth(), 1),
    );

    const diaDropdown = String(candidateDropdown.getDate()).padStart(2, '0');
    const mesDropdown = String(candidateDropdown.getMonth() + 1).padStart(2, '0');
    const anoDropdown = candidateDropdown.getFullYear();
    const isoDropdown = `${anoDropdown}-${mesDropdown}-${diaDropdown}`;

    this.displayValueDropdown.set(`${diaDropdown}/${mesDropdown}/${anoDropdown}`);

    const isPastDropdown = candidateDropdown < this.getTodayStartDropdown();
    this.validationErrorDropdown.set(isPastDropdown ? { dataPassada: true } : null);
    this.notifyValidatorChangeDropdown();
    this.onChangeDropdown(isoDropdown);
    this.onTouchedDropdown();
    this.closeDropdown();
    this.focusInputAfterSelectionDropdown();
  }

  isSelectedDropdown(dayDropdown: Date | null): boolean {
    if (!dayDropdown || !this.selectedDateDropdown()) return false;
    const selectedDropdown = this.selectedDateDropdown()!;
    return (
      dayDropdown.getDate() === selectedDropdown.getDate() &&
      dayDropdown.getMonth() === selectedDropdown.getMonth() &&
      dayDropdown.getFullYear() === selectedDropdown.getFullYear()
    );
  }

  isTodayDropdown(dayDropdown: Date | null): boolean {
    if (!dayDropdown) return false;
    const hojeDropdown = this.getTodayStartDropdown();
    return (
      dayDropdown.getDate() === hojeDropdown.getDate() &&
      dayDropdown.getMonth() === hojeDropdown.getMonth() &&
      dayDropdown.getFullYear() === hojeDropdown.getFullYear()
    );
  }

  // ==========================================
  // 5. DIGITAÇÃO, MÁSCARA E CONFIRMAÇÃO (ENTER)
  // ==========================================
  onInputDropdown(eventDropdown: Event): void {
    const inputEventDropdown = eventDropdown as InputEvent;
    const inputElementDropdown = eventDropdown.target as HTMLInputElement;
    const prevValueDropdown = this.displayValueDropdown();
    const isInsertingDropdown =
      inputEventDropdown.inputType === 'insertText' ||
      inputEventDropdown.inputType === 'insertFromPaste' ||
      inputElementDropdown.value.length > prevValueDropdown.length;

    const maskedDropdown = this.formatBrMaskDropdown(
      inputElementDropdown.value,
      isInsertingDropdown,
    );
    inputElementDropdown.value = maskedDropdown;
    this.displayValueDropdown.set(maskedDropdown);

    if (!this.isOpenDropdown()) {
      this.openDropdown();
    }

    if (!maskedDropdown) {
      this.selectedDateDropdown.set(null);
      this.validationErrorDropdown.set(null);
      this.notifyValidatorChangeDropdown();
      this.onChangeDropdown(null);
      return;
    }

    this.syncCalendarFromTypedDropdown(maskedDropdown);

    const parsedResultDropdown = this.parseAndValidateBrDateDropdown(maskedDropdown);

    if (parsedResultDropdown.date && parsedResultDropdown.iso && !parsedResultDropdown.error) {
      this.selectedDateDropdown.set(parsedResultDropdown.date);
      this.currentMonthDropdown.set(
        new Date(parsedResultDropdown.date.getFullYear(), parsedResultDropdown.date.getMonth(), 1),
      );
      this.validationErrorDropdown.set(null);
      this.onChangeDropdown(parsedResultDropdown.iso);
      this.onTouchedDropdown();
      this.notifyValidatorChangeDropdown();
      return;
    }

    this.validationErrorDropdown.set(parsedResultDropdown.error ?? { dataInvalida: true });
    this.onChangeDropdown(parsedResultDropdown.iso ?? maskedDropdown);
    this.onTouchedDropdown();
    this.notifyValidatorChangeDropdown();
  }

  onEnterDropdown(eventDropdown: Event): void {
    eventDropdown.preventDefault();
    const currentMaskedDropdown = this.formatBrMaskDropdown(this.displayValueDropdown(), false);
    this.displayValueDropdown.set(currentMaskedDropdown);
    this.syncCalendarFromTypedDropdown(currentMaskedDropdown);

    if (!currentMaskedDropdown) {
      this.selectedDateDropdown.set(null);
      this.validationErrorDropdown.set(null);
      this.notifyValidatorChangeDropdown();
      this.onChangeDropdown(null);
      this.onTouchedDropdown();
      this.closeDropdown();
      this.focusInputAfterSelectionDropdown();
      return;
    }

    const parsedResultDropdown = this.parseAndValidateBrDateDropdown(currentMaskedDropdown);

    if (parsedResultDropdown.date && parsedResultDropdown.iso) {
      const diaDropdown = String(parsedResultDropdown.date.getDate()).padStart(2, '0');
      const mesDropdown = String(parsedResultDropdown.date.getMonth() + 1).padStart(2, '0');
      const anoDropdown = parsedResultDropdown.date.getFullYear();
      const isoDropdown = `${anoDropdown}-${mesDropdown}-${diaDropdown}`;

      this.displayValueDropdown.set(`${diaDropdown}/${mesDropdown}/${anoDropdown}`);
      this.selectedDateDropdown.set(parsedResultDropdown.date);
      this.currentMonthDropdown.set(
        new Date(parsedResultDropdown.date.getFullYear(), parsedResultDropdown.date.getMonth(), 1),
      );
      this.validationErrorDropdown.set(parsedResultDropdown.error);
      this.notifyValidatorChangeDropdown();
      this.onChangeDropdown(isoDropdown);
      this.onTouchedDropdown();
      this.closeDropdown();
      this.focusInputAfterSelectionDropdown();
      return;
    }

    this.validationErrorDropdown.set(parsedResultDropdown.error ?? { dataInvalida: true });
    this.notifyValidatorChangeDropdown();
    this.onChangeDropdown(currentMaskedDropdown);
    this.onTouchedDropdown();
    this.closeDropdown();
    this.focusInputAfterSelectionDropdown();
  }

  // ==========================================
  // 6. FORMULÁRIO: CONTROL VALUE ACCESSOR E VALIDATOR
  // ==========================================
  private onChangeDropdown: (value: string | null) => void = () => {};
  private onTouchedDropdown: () => void = () => {};
  private notifyValidatorChangeDropdown: () => void = () => {};

  writeValue(valueDropdown: string | null): void {
    if (!valueDropdown) {
      this.displayValueDropdown.set('');
      this.selectedDateDropdown.set(null);
      this.validationErrorDropdown.set(null);
      this.notifyValidatorChangeDropdown();
      return;
    }

    const strDropdown = String(valueDropdown).trim();
    const partsDropdown = strDropdown.split('-');
    if (partsDropdown.length !== 3) {
      this.displayValueDropdown.set(strDropdown);
      this.syncCalendarFromTypedDropdown(strDropdown);
      this.validationErrorDropdown.set({ dataInvalida: true });
      this.notifyValidatorChangeDropdown();
      return;
    }

    const [anoDropdown, mesDropdown, diaDropdown] = partsDropdown;
    const brFormattedDropdown = `${diaDropdown.padStart(2, '0')}/${mesDropdown.padStart(2, '0')}/${anoDropdown}`;
    const parsedResultDropdown = this.parseAndValidateBrDateDropdown(brFormattedDropdown);

    this.displayValueDropdown.set(brFormattedDropdown);
    this.syncCalendarFromTypedDropdown(brFormattedDropdown);

    if (parsedResultDropdown.date) {
      this.selectedDateDropdown.set(parsedResultDropdown.date);
      this.currentMonthDropdown.set(
        new Date(parsedResultDropdown.date.getFullYear(), parsedResultDropdown.date.getMonth(), 1),
      );
    }

    this.validationErrorDropdown.set(parsedResultDropdown.error);
    this.notifyValidatorChangeDropdown();
  }

  registerOnChange(fnDropdown: (value: string | null) => void): void {
    this.onChangeDropdown = fnDropdown;
  }

  registerOnTouched(fnDropdown: () => void): void {
    this.onTouchedDropdown = fnDropdown;
  }

  validate(controlDropdown: AbstractControl): ValidationErrors | null {
    const valDropdown = controlDropdown.value;
    if (!valDropdown) {
      return this.validationErrorDropdown();
    }

    const strValDropdown = String(valDropdown).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(strValDropdown)) {
      const [anoStrDropdown, mesStrDropdown, diaStrDropdown] = strValDropdown.split('-');
      const brCandidateDropdown = `${diaStrDropdown}/${mesStrDropdown}/${anoStrDropdown}`;
      const resultDropdown = this.parseAndValidateBrDateDropdown(brCandidateDropdown);
      return resultDropdown.error;
    }

    const typedResultDropdown = this.parseAndValidateBrDateDropdown(strValDropdown);
    return typedResultDropdown.error ?? this.validationErrorDropdown() ?? { dataInvalida: true };
  }

  registerOnValidatorChange(fnDropdown: () => void): void {
    this.notifyValidatorChangeDropdown = fnDropdown;
  }

  // ==========================================
  // 7. HELPERS INTERNOS DE DATA E MÁSCARA
  // ==========================================
  private getTodayStartDropdown(): Date {
    const hojeDropdown = new Date();
    hojeDropdown.setHours(0, 0, 0, 0);
    return hojeDropdown;
  }

  private formatBrMaskDropdown(rawValueDropdown: string, isInsertingDropdown: boolean): string {
    const digitsDropdown = rawValueDropdown.replace(/\D/g, '').slice(0, 8);
    if (!digitsDropdown) {
      return '';
    }

    if (!isInsertingDropdown) {
      if (digitsDropdown.length <= 2) return digitsDropdown;
      if (digitsDropdown.length <= 4) {
        return `${digitsDropdown.slice(0, 2)}/${digitsDropdown.slice(2)}`;
      }
      return `${digitsDropdown.slice(0, 2)}/${digitsDropdown.slice(2, 4)}/${digitsDropdown.slice(4)}`;
    }

    if (digitsDropdown.length < 2) {
      return digitsDropdown;
    }
    if (digitsDropdown.length === 2) {
      return `${digitsDropdown}/`;
    }
    if (digitsDropdown.length < 4) {
      return `${digitsDropdown.slice(0, 2)}/${digitsDropdown.slice(2)}`;
    }
    if (digitsDropdown.length === 4) {
      return `${digitsDropdown.slice(0, 2)}/${digitsDropdown.slice(2, 4)}/`;
    }
    return `${digitsDropdown.slice(0, 2)}/${digitsDropdown.slice(2, 4)}/${digitsDropdown.slice(4)}`;
  }

  private syncCalendarFromTypedDropdown(formattedBrDropdown: string): void {
    const partsDropdown = formattedBrDropdown.trim().split('/');
    if (partsDropdown.length !== 3) return;

    const [diaStrDropdown, mesStrDropdown, anoStrDropdown] = partsDropdown;
    const anoNumDropdown = Number(anoStrDropdown);
    const mesNumDropdown = Number(mesStrDropdown);
    const diaNumDropdown = Number(diaStrDropdown);

    if (
      anoStrDropdown.length === 4 &&
      Number.isInteger(anoNumDropdown) &&
      Number.isInteger(mesNumDropdown) &&
      mesNumDropdown >= 1 &&
      mesNumDropdown <= 12
    ) {
      this.currentMonthDropdown.set(new Date(anoNumDropdown, mesNumDropdown - 1, 1));
    }

    if (
      anoStrDropdown.length === 4 &&
      Number.isInteger(anoNumDropdown) &&
      Number.isInteger(mesNumDropdown) &&
      mesNumDropdown >= 1 &&
      mesNumDropdown <= 12 &&
      Number.isInteger(diaNumDropdown) &&
      diaNumDropdown >= 1 &&
      diaNumDropdown <= 31
    ) {
      const visualDateDropdown = new Date(anoNumDropdown, mesNumDropdown - 1, diaNumDropdown);
      const isRealDayInMonthDropdown =
        visualDateDropdown.getFullYear() === anoNumDropdown &&
        visualDateDropdown.getMonth() === mesNumDropdown - 1 &&
        visualDateDropdown.getDate() === diaNumDropdown;

      if (isRealDayInMonthDropdown && !Number.isNaN(visualDateDropdown.getTime())) {
        visualDateDropdown.setHours(0, 0, 0, 0);
        this.selectedDateDropdown.set(visualDateDropdown);
        return;
      }
    }

    this.selectedDateDropdown.set(null);
  }

  private parseAndValidateBrDateDropdown(formattedBrDropdown: string): {
    date: Date | null;
    iso: string | null;
    error: ValidationErrors | null;
  } {
    const trimmedDropdown = formattedBrDropdown.trim();
    if (!trimmedDropdown) {
      return { date: null, iso: null, error: null };
    }

    const partsDropdown = trimmedDropdown.split('/');
    if (partsDropdown.length !== 3) {
      return { date: null, iso: null, error: { dataInvalida: true } };
    }

    const [diaStrDropdown, mesStrDropdown, anoStrDropdown] = partsDropdown;
    if (
      diaStrDropdown.length < 1 ||
      diaStrDropdown.length > 2 ||
      mesStrDropdown.length < 1 ||
      mesStrDropdown.length > 2 ||
      anoStrDropdown.length !== 4
    ) {
      return { date: null, iso: null, error: { dataInvalida: true } };
    }

    const diaNumDropdown = Number(diaStrDropdown);
    const mesNumDropdown = Number(mesStrDropdown);
    const anoNumDropdown = Number(anoStrDropdown);

    if (
      !Number.isInteger(diaNumDropdown) ||
      !Number.isInteger(mesNumDropdown) ||
      !Number.isInteger(anoNumDropdown) ||
      mesNumDropdown < 1 ||
      mesNumDropdown > 12 ||
      diaNumDropdown < 1 ||
      diaNumDropdown > 31
    ) {
      return { date: null, iso: null, error: { dataInvalida: true } };
    }

    const candidateDateDropdown = new Date(anoNumDropdown, mesNumDropdown - 1, diaNumDropdown);
    const isRealCalendarDateDropdown =
      candidateDateDropdown.getFullYear() === anoNumDropdown &&
      candidateDateDropdown.getMonth() === mesNumDropdown - 1 &&
      candidateDateDropdown.getDate() === diaNumDropdown;

    if (!isRealCalendarDateDropdown || Number.isNaN(candidateDateDropdown.getTime())) {
      return { date: null, iso: null, error: { dataInvalida: true } };
    }

    candidateDateDropdown.setHours(0, 0, 0, 0);
    const diaPadDropdown = String(diaNumDropdown).padStart(2, '0');
    const mesPadDropdown = String(mesNumDropdown).padStart(2, '0');
    const isoDropdown = `${anoNumDropdown}-${mesPadDropdown}-${diaPadDropdown}`;

    const hojeDropdown = this.getTodayStartDropdown();
    if (candidateDateDropdown < hojeDropdown) {
      return { date: candidateDateDropdown, iso: isoDropdown, error: { dataPassada: true } };
    }

    return { date: candidateDateDropdown, iso: isoDropdown, error: null };
  }
}
