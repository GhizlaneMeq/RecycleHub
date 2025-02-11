import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing: boolean = false;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.validateAge]],
      profilePhoto: [''],
      points: [0] // Ajouter le champ points
    });
  }

  ngOnInit() {
    this.authService.getUser().subscribe(
      user => {
        if (user) {
          this.profileForm.patchValue(user);
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching user:', error);
        this.isLoading = false;
      }
    );
  }

  validateAge(control: any): { [key: string]: boolean } | null {
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return { underAge: true }; // Retourne une erreur si l'utilisateur a moins de 18 ans
    }
    return null;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.authService.updateUser(this.profileForm.value);
      this.isEditing = false;
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteAccount();
      this.router.navigate(['/register']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileForm.get('profilePhoto')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  convertPoints(points: number): void {
    if (this.profileForm.get('points')?.value >= points) {
      this.authService.convertPointsToVoucher(this.authService.getUserId(), points);
      this.profileForm.patchValue({ points: this.profileForm.get('points')?.value - points });
      alert(`You have successfully converted ${points} points into a voucher.`);
    } else {
      alert('You do not have enough points.');
    }
  }
}