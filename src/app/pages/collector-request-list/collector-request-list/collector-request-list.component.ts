import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { Request } from "../../../core/models/request.model";
import { Store, select } from "@ngrx/store";
import { selectPendingRequests, selectRequestLoading, selectRequestError } from "../../../state/requests/requests.selectors";
import * as RequestActions from "../../../state/requests/requests.actions";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-collector-request-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AsyncPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './collector-request-list.component.html'
})
export class CollectorRequestListComponent {
  requests$: Observable<Request[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  userAddress: string;

  constructor(private store: Store, private authService: AuthService) {
    this.requests$ = this.store.pipe(select(selectPendingRequests));
    this.loading$ = this.store.pipe(select(selectRequestLoading));  // Handle loading state
    this.error$ = this.store.pipe(select(selectRequestError));  // Handle error state
    this.userAddress = this.authService.getUserAddress();
  }

  ngOnInit(): void {
    console.log("User Address:", this.userAddress);
    this.requests$.subscribe(requests => {
      requests.forEach(request => {
        console.log("Request Address:", request.address);
      });
    });
    this.store.dispatch(RequestActions.loadCollectorRequests());
  }
  
  

  updateRequestStatus(userId: string, requestId: number, status: 'Occupied' | 'InProgress' | 'Validated' | 'Rejected') {
    this.store.dispatch(RequestActions.updateRequestStatus({ requestId, status }));
    
    if (status === 'Validated') {
      this.calculateAndAddPoints(userId);
    }
  }

  calculateAndAddPoints(userId: string) {
    this.authService.updatePointsForValidatedRequests(userId);
  }
}

