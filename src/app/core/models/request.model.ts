export interface WasteItem {
    type: string;
    weight: number;
  }
  
  export interface Request {
    id: number;
    userId: string;
    wastes: WasteItem[];
    address: string;
    date: string;
    time: string;
    notes?: string;
    status: 'Pending' | 'Occupied' | 'InProgress' | 'Validated' | 'Rejected';
    isCalculated?: boolean;
  }