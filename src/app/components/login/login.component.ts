import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {CommonModule} from "@angular/common";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone:true ,
  imports:[ReactiveFormsModule , CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      if (!this.authService.login(email, password)) {
        this.errorMessage = 'Invalid credentials';
      }
      this.isLoading = false;
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}