import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as RequestActions from '../../../state/requests/requests.actions';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-request-form',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './request-form.component.html'
})
export class RequestFormComponent {
  requestForm: FormGroup;
  userId: string;

  constructor(private fb: FormBuilder, private store: Store, private authService: AuthService) {
    this.userId = this.authService.getUserId();
    this.requestForm = this.fb.group({
      wastes: this.fb.array([this.createWasteItem()]),
      address: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  createWasteItem(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get wastes(): FormArray {
    return this.requestForm.get('wastes') as FormArray;
  }

  addWasteItem() {
    const wastes = this.requestForm.get('wastes') as any;
    wastes.push(this.createWasteItem());
  }

  removeWasteItem(index: number) {
    const wastes = this.requestForm.get('wastes') as any;
    if (wastes.length > 1) {
      wastes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const wastes = this.requestForm.value.wastes.map((item: any) => ({
        type: item.type,
        weight: item.weight
      }));
      const request = {
        ...this.requestForm.value,
        wastes,
        userId: this.userId,
        status: 'Pending'
      };
      this.store.dispatch(RequestActions.addRequest({ request }));
      this.requestForm.reset();
      this.requestForm.setControl('wastes', this.fb.array([this.createWasteItem()]));
    }
  }
}