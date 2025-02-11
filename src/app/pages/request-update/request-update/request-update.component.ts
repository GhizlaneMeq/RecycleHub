import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Request, WasteItem } from '../../../core/models/request.model';
import * as RequestActions from '../../../state/requests/requests.actions';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { CollectRequestService } from '../../../core/services/collect-request.service';
import { RequestService } from '../../../core/services/request.service';

@Component({
  selector: 'app-request-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-update.component.html'
})
export class RequestUpdateComponent implements OnInit, OnDestroy {
  requestForm: FormGroup;
  userId: string;
  requestId?: number;
  requestData?: Request;
  private routeSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId();
    this.requestForm = this.fb.group({
      wastes: this.fb.array([]),
      address: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.getRequestFromLocalStorage();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  getRequestFromLocalStorage() {
    const allRequests: Request[] = JSON.parse(localStorage.getItem('requests') || '[]');
    this.requestData = allRequests.find((req) => req.userId === this.userId && req.id === this.requestId);
    if (this.requestData) {
      this.initForm();
    } else {
      console.log('Request not found');
      this.router.navigate(['/request-list']);
    }
  }

  initForm() {
    const wasteArray = this.fb.array(
      this.requestData?.wastes.map(waste => this.createWasteItem(waste)) || []
    );
    this.requestForm = this.fb.group({
      wastes: wasteArray,
      address: [this.requestData?.address, Validators.required],
      date: [this.requestData?.date, Validators.required],
      time: [this.requestData?.time, Validators.required],
      notes: [this.requestData?.notes || '']
    });
  }

  createWasteItem(waste?: WasteItem): FormGroup {
    return this.fb.group({
      type: [waste?.type || '', Validators.required],
      weight: [waste?.weight || '', [Validators.required, Validators.min(1)]]
    });
  }

  addWasteItem() {
    const wastes = this.requestForm.get('wastes') as FormArray;
    wastes.push(this.createWasteItem());
  }

  removeWasteItem(index: number) {
    const wastes = this.requestForm.get('wastes') as FormArray;
    if (wastes.length > 1) {
      wastes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.requestForm.valid) {
      const updatedRequest: Request = {
        ...this.requestForm.value,
        id: this.requestId!,
        userId: this.userId,
        status: 'Pending'
      };
      this.requestService.updateRequest(updatedRequest).subscribe(() => {
        this.store.dispatch(RequestActions.updateRequestSuccess({ request: updatedRequest }));
        this.router.navigate(['/request-list']);
      });
    } else {
      this.requestForm.markAllAsTouched();
    }
  }


  getWasteControls(): FormGroup[] {
    return (this.requestForm.get('wastes') as FormArray).controls as FormGroup[];
  }


}