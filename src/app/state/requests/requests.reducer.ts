import { createReducer, on } from '@ngrx/store';
import { initialRequestState, RequestState } from './requests.state';
import * as RequestActions from './requests.actions';

export const requestsReducer = createReducer(
  initialRequestState,



  on(RequestActions.loadRequestsForUserSuccess, (state, { requests }) => ({
    ...state,
    requests,
  })),



  on(RequestActions.addRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request],
  })),




  on(RequestActions.deleteRequestSuccess, (state, { id }) => ({
    ...state,
    requests: state.requests.filter(req => req.id !== id),
  })),



on(RequestActions.updateRequestSuccess, (state, { request }) => ({
  ...state,
  requests: state.requests.map(req =>
    req.id === request.id ? { ...req, ...request } : req
  ),
})),




  on(RequestActions.loadCollectorRequests, (state) => ({
    ...state,
  })),

  on(RequestActions.loadCollectorRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
  })),






  on(RequestActions.updateRequestStatus, (state, { requestId, status }) => ({
    ...state,
    requests: state.requests.map(req =>
      req.id === requestId ? { ...req, status } : req
    ),
  })),


  on(RequestActions.updateRequestStatusSuccess, (state, { requestId, status }) => ({
    ...state,
    requests: state.requests.map(req =>
      req.id === requestId ? { ...req, status } : req
    ),
  }))


);