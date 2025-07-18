import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usersKey = 'users';
  private readonly tokenKey = 'token';
  private readonly currentUserKey = 'currentUser';

  constructor(private router: Router) {}

  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const exists = users.some(u => u.username === user.username);
    if (exists) return false;

    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return true;
  }

  login(credentials: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      localStorage.setItem(this.tokenKey, 'true');
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.tokenKey) === 'true';
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }
}
