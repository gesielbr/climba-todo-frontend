import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { TodoList } from '../todo-list/todo-list';
import { CreateTask } from '../create-task/create-task';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, TodoList, CreateTask, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css', // Lembre-se de mover os estilos do app.css para layout.css
})
export class Layout {
  searchTerm = signal('');
}
