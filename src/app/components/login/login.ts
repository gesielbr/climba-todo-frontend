import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);

  entrar(event: Event) {
    event.preventDefault(); // Evita o recarregamento padrão do <form>
    this.router.navigate(['/tasks']);
  }
}
