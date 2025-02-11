import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CollectorGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isCollector()) {
      return true;
    } else {
      alert("Access Denied: Only Collectors can access this page.");
      this.router.navigate(['/home']);
      return false;
    }
  }
}
