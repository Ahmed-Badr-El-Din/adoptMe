import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslate } from './app/translate.config';
import { provideAnimations } from '@angular/platform-browser/animations';


bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideAnimations(), // ضروري لتفعيل animations
    provideHttpClient(), // ضروري لتفعيل HttpClient
    ...(appConfig.providers || []),
    provideTranslate(), //  تفعيل الترجمة
  ],
}).catch((err) => console.error(err));
