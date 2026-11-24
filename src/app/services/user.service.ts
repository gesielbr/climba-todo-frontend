import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly STORAGE_KEY = 'app.user.name';

  // signal privado + readonly público (encapsulamento)
  private readonly _name = signal<string>(localStorage.getItem(this.STORAGE_KEY) ?? '');

  readonly name = this._name.asReadonly();

  setName(value: string) {
    const clean = value.trim();
    this._name.set(clean);
    if (clean) localStorage.setItem(this.STORAGE_KEY, clean);
    else localStorage.removeItem(this.STORAGE_KEY);
  }

  clear() {
    this._name.set('');
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
