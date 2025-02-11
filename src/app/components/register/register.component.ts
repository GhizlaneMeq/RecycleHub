import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from "@angular/common";
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  currentStep: number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.validateAge]],
      profilePhoto: ['']
    });
  }

  validateAge(control: any): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return { underAge: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        this.authService.register(this.registerForm.value);
        this.router.navigate(['/login']);
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.registerForm.get('profilePhoto')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (
        this.registerForm.get('name')?.valid &&
        this.registerForm.get('email')?.valid &&
        this.registerForm.get('phone')?.valid &&
        this.registerForm.get('password')?.valid
      ) {
        this.currentStep = 2;
      } else {
        this.registerForm.markAllAsTouched();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }
}
