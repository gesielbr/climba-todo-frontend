import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private userService = inject(UserService);

  // signal query — moderno, sem @ViewChild
  private nomeInput = viewChild<ElementRef<HTMLInputElement>>('nomeInput');

  entrar(event: Event) {
    event.preventDefault();
    const nome = this.nomeInput()?.nativeElement.value.trim() ?? '';
    if (!nome) return;

    this.userService.setName(nome);
    this.router.navigate(['/tasks']);
  }
}
