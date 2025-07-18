import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  credentialsForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirm: ['', Validators.required],
  });

 
  preferencesForm: FormGroup = this.fb.group({
    language: ['en'],
    darkMode: [false],
  });

  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService // ✅ ضروري لتغيير اللغة
  ) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const { username, password } = JSON.parse(savedUser);
      this.credentialsForm.patchValue({
        username,
        password,
        confirm: password,
      });
    }

    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const { language, darkMode } = JSON.parse(savedSettings);
      this.preferencesForm.patchValue({ language, darkMode });
      this.translate.use(language);       // Change language    
      this.setDirection(language);            // Change text direction
      this.applyDarkMode(!!darkMode);         // Apply dark mode
    }
  }

  saveCredentials(): void {
    this.error = '';
    this.success = false;

    const { username, password, confirm } = this.credentialsForm.value;

    if (!username || !password || !confirm) {
      this.error = 'All fields are required.';
      return;
    }

    if (password !== confirm) {
      this.error = 'Passwords do not match.';
      return;
    }

    const user = { username, password };
    localStorage.setItem('user', JSON.stringify(user));
    this.success = true;
  }

  savePreferences(): void {
    const { language, darkMode } = this.preferencesForm.value;
    const settings = { language, darkMode };

    localStorage.setItem('settings', JSON.stringify(settings));
    this.translate.use(language);       // Change language
    this.setDirection(language);        // Change text direction
    this.applyDarkMode(!!darkMode);     // Apply dark mode
    this.success = true;
  }

  applyDarkMode(isDark: boolean): void {
    const html = document.documentElement;
    isDark ? html.classList.add('dark') : html.classList.remove('dark');
  }

  setDirection(lang: string): void {
    const html = document.documentElement;
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
}
