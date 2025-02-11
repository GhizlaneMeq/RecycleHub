import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Request } from '../../../core/models/request.model';
import { selectUserRequests } from '../../../state/requests/requests.selectors';
import * as RequestActions from '../../../state/requests/requests.actions';
import { AuthService } from '../../../core/services/auth.service';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterModule} from "@angular/router";

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports:[CommonModule , RouterModule],
  templateUrl: './request-list.component.html'
})
export class RequestListComponent implements OnInit {
  userId: string;
  requests$: Observable<Request[]>;

  constructor(private store: Store, private authService: AuthService) {
    this.userId = this.authService.getUserId();
    console.log(this.userId);
    this.requests$ = this.store.select(selectUserRequests(this.userId));
  }

  ngOnInit(): void {
    this.store.dispatch(RequestActions.loadRequestsForUser({ userId: this.userId }));
  }

  deleteRequest(id: number) {
    this.store.dispatch(RequestActions.deleteRequest({ id }));
  }
}