import { Component, signal } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TodoList } from './components/todo-list/todo-list';
import { CreateTask } from './components/create-task/create-task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, TodoList, CreateTask],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  searchTerm = signal('');
}
