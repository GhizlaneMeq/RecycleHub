import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Request, WasteItem } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private requestsKey = 'requests';

  constructor() {}

  getRequestsForUser(userId: string): Observable<Request[]> {
    const requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    return of(requests.filter((request: Request) => request.userId === userId));
  }

  addRequest(request: Request): Observable<Request> {
    const requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    const newRequest: Request = {
      ...request,
      id: requests.length + 1,
      status: 'Pending',
      isCalculated: false 
    };
    requests.push(newRequest);
    localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    alert('Request submitted successfully!');
    return of(newRequest);
  }

  updateRequest(updatedRequest: Request): Observable<Request> {
    const requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    const index = requests.findIndex((req: Request) => req.id === updatedRequest.id);
    if (index !== -1) {
      requests[index] = updatedRequest;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
    return of(updatedRequest);
  }

  getPendingRequests(): Observable<Request[]> {
    const requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    return of(requests.filter((request: Request) => request.status === 'Pending' || request.status === 'Occupied' || request.status === 'InProgress'));
  }

  updateRequestStatus(requestId: number, status: 'Occupied' | 'InProgress' | 'Validated' | 'Rejected'): Observable<void> {
    const requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    const requestToUpdate = requests.find((req: Request) => req.id === requestId);
    if (requestToUpdate) {
      requestToUpdate.status = status;
      localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    }
    return of();
  }

  deleteRequest(id: number): Observable<boolean> {
    let requests = JSON.parse(localStorage.getItem(this.requestsKey) || '[]');
    requests = requests.filter((req: Request) => req.id !== id);
    localStorage.setItem(this.requestsKey, JSON.stringify(requests));
    return of(true);
  }

  calculatePoints(request: Request): number {
    let totalPoints = 0;
    request.wastes.forEach((waste: WasteItem) => {
      switch (waste.type.toLowerCase()) {
        case 'plastique':
          totalPoints += waste.weight * 2;
          break;
        case 'verre':
          totalPoints += waste.weight * 1;
          break;
        case 'papier':
          totalPoints += waste.weight * 1;
          break;
        case 'metal':
          totalPoints += waste.weight * 5;
          break;
      }
    });
    return totalPoints;
  }
}