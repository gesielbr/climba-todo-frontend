import { Component, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { TodoList } from '../todo-list/todo-list';
import { CreateTask } from '../create-task/create-task';

@Component({
  selector: 'app-home',
  imports: [SidebarComponent, TodoList, CreateTask],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], // Se tiver estilos no app.css, mova para home.css
})
export class Home {
  searchTerm = signal('');
}
