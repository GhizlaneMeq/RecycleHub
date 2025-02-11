import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collect-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './collect-request.component.html',
  styleUrl: './collect-request.component.css'
})
export class CollectRequestComponent {
  collectRequestForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.collectRequestForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.collectRequestForm.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }
    
    console.log('Collect Request Submitted:', this.collectRequestForm.value);
  }
}
