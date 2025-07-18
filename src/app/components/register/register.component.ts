// src/app/components/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  error = '';

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onRegister() {
    const { username, password, confirmPassword } = this.registerForm.value;

    if (!username || !password || !confirmPassword) {
      this.error = 'All fields are required';
      return;
    }

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const success = this.auth.register({ username, password });

    if (success) {
      this.router.navigate(['/login']);
    } else {
      this.error = 'Username already exists';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
