// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  error = '';
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    if (this.auth.login({ username: username!, password: password! })) {
      this.router.navigate(['/pets']);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
