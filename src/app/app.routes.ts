import { Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { RequestFormComponent } from './pages/request-form/request-form/request-form.component';
import { RequestListComponent } from './pages/request-list/request-list/request-list.component';
import { RequestUpdateComponent } from './pages/request-update/request-update/request-update.component';
import { CollectorRequestListComponent } from './pages/collector-request-list/collector-request-list/collector-request-list.component';
import { LoginComponent } from './components/login/login.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { CollectorGuard } from './core/guards/collector.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard] }, 
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] }, 
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'request-form', component: RequestFormComponent, canActivate: [authGuard]},
  { path: 'request-list', component: RequestListComponent, canActivate: [authGuard]},
  { path: 'request-update/:id', component: RequestUpdateComponent, canActivate: [authGuard] },
  { path: 'collector-requests', component: CollectorRequestListComponent ,canActivate: [authGuard, CollectorGuard]},
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' }
];
