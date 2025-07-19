// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { ToastrService } from 'ngx-toastr';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toastr: ToastrService) { }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onLogin() {
  const { username, password } = this.loginForm.value;
  if (this.auth.login({ username: username!, password: password! })) {
    this.toastr.success('Logged in successfully!');
    this.router.navigate(['/pets']);
  } else {
    this.error = 'Invalid credentials';
    this.toastr.error('Invalid username or password', 'Login Failed');
  }
}

}
