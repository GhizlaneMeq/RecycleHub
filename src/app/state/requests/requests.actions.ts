import { createAction, props } from '@ngrx/store';
import { Request } from '../../core/models/request.model';




export const loadRequestsForUser = createAction(
  '[Request] Load Requests for User',
  props<{ userId: string }>()
);

export const loadRequestsForUserSuccess = createAction(
  '[Request] Load Requests for User Success',
  props<{ requests: Request[] }>()
);



export const addRequest = createAction(
  '[Request] Add Request',
  props<{ request: Request }>()
);

export const addRequestSuccess = createAction(
  '[Request] Add Request Success',
  props<{ request: Request }>()
);



export const deleteRequest = createAction(
  '[Request] Delete Request',
  props<{ id: number }>()
);

export const deleteRequestSuccess = createAction(
  '[Request] Delete Request Success',
  props<{ id: number }>()
);





export const updateRequest = createAction(
  '[Request] Update Request',
  props<{ request: Request }>()
);

export const updateRequestSuccess = createAction(
  '[Request] Update Request Success',
  props<{ request: Request }>()
);



export const loadCollectorRequests = createAction(
  '[Request] Load Collector Requests'
);

export const loadCollectorRequestsSuccess = createAction(
  '[Request] Load Collector Requests Success',
  props<{ requests: Request[] }>()
);





export const updateRequestStatus = createAction(
  '[Request] Update Request Status',
  props<{ requestId: number; status: 'Occupied' | 'InProgress' | 'Validated' | 'Rejected' }>()
);

export const updateRequestStatusSuccess = createAction(
  '[Request] Update Request Status Success',
  props<{ requestId: number; status: 'Occupied' | 'InProgress' | 'Validated' | 'Rejected' }>()
);