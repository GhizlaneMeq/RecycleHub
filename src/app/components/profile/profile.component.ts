import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';  // Assuming a UserService to manage user data
import { AuthService } from '../../core/services/auth.service'; // For authentication purposes
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup= new FormGroup({});
  user: any;  
  isSubmitting: boolean = false;
  points: number = 0;  

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (!user) {
          console.error("No user found!");
          this.router.navigate(['/auth/sign-in']); 
          return;
        }
  
        this.user = user;
        this.points = user.points || 0;
  
        console.log("Fetched user:", this.user);
  
        this.profileForm = this.fb.group({
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          phoneNumber: [user.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
          address: [user.address, Validators.required],
          birthDate: [user.birthday, Validators.required],
          profilePhoto: ['']
        });
      },
      (error) => {
        console.error("Error fetching user:", error);
      }
    );
  }
  

  get control() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
  
    this.isSubmitting = true;
    const updatedUser = this.profileForm.value;
    const profilePhoto = this.profileForm.get('profilePhoto')?.value || null;
  
    this.userService.updateUserProfile(updatedUser).subscribe(
      (updatedUser) => {
        this.user = updatedUser;  
        this.isSubmitting = false;
      },
      (error) => {
        this.isSubmitting = false;
        console.error('Profile update failed', error);
      }
    );
  }
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.profileForm.patchValue({ profilePhoto: base64String });
        this.user.profilePhoto = base64String; 
      };
      reader.onerror = (error) => console.error('Error reading file:', error);
    }
  }
  
  

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.userService.deleteAccount().subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/']);
      });
    }
  }
}
