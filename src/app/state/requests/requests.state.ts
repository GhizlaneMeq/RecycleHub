import { Request } from "../../core/models/request.model";

export interface RequestState {
  requests: Request[];
  loading: boolean;  // ✅ Indicates if data is being fetched
  error: string | null;  // ✅ Stores any error messages
}

export const initialRequestState: RequestState = {
  requests: [],
  loading: false,
  error: null
};
