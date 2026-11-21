import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCardComponent } from './todo-card';
import { Todo } from '../../models/todo.model';

describe('TodoCardComponent', () => {
  let component: TodoCardComponent;
  let fixture: ComponentFixture<TodoCardComponent>;

  const mockTodo: Todo = {
    id: '1',
    title: 'Estudar Angular',
    description: 'Estudar testes com Vitest',
    dueDate: '2026-11-25T12:00:00.000Z',
    isCompleted: false,
    createdAt: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoCardComponent);

    fixture.componentRef.setInput('todo', mockTodo);

    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
