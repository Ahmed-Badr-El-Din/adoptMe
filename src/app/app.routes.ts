import { Routes } from '@angular/router';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

import { AdoptedComponent } from './components/adopted/adopted.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { PetsComponent } from './components/pets/pets.component';

import { SettingsComponent } from './components/settings/settings.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthGuard } from './guards/auth.guard'; //  import guard

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [AuthGuard], //  protect these routes
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      { path: 'adopted', component: AdoptedComponent },
      { path: 'favourites', component: FavouritesComponent },
      { path: 'pets', component: PetsComponent },
    
      { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: '**', component: NotfoundComponent }
];
