export interface User {
  id: string; 
  name: string; 
  email: string; 
  password: string; 
  phone: string; 
  address: string; 
  dateOfBirth: string; 
  profilePhoto?: string; 
  points: number;
  role?: 'particulier' | 'collecteur'; 
}