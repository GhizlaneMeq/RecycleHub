import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RequestState } from './requests.state';

export const selectRequestState = createFeatureSelector<RequestState>('requests');



export const selectAllRequests = createSelector(
  selectRequestState,
  (state) => state.requests
);



export const selectUserRequests = (userId: string) => createSelector(
  selectRequestState,
  (state) => state.requests.filter(req => req.userId === userId)
);



export const selectPendingRequests = createSelector(
  selectRequestState,
  (state) => state.requests ? state.requests.filter(req => ['Pending', 'Occupied', 'InProgress'].includes(req.status)) : []
);

export const selectRequestError = createSelector(
  selectRequestState,
  (state) => state.error

);

export const selectRequestLoading = createSelector(
  selectRequestState,
  (state) => state.loading
);