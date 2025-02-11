import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Request, WasteItem } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'users';
  private isLoggedInKey = 'isLoggedIn';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());

  constructor(private router: Router) {}

  private getUserFromLocalStorage(): User | null {
    return JSON.parse(localStorage.getItem(this.isLoggedInKey) || 'null');
  }

  register(user: User): void {
    const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
    const newUser: User = {
      ...user,
      id: `user-${users.length + 1}`, 
      points: 0, 
      role: 'particulier' 
    };
    users.push(newUser);
    localStorage.setItem(this.userKey, JSON.stringify(users));
    localStorage.setItem(this.isLoggedInKey, JSON.stringify(newUser));

    this.currentUserSubject.next(newUser);
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(this.isLoggedInKey, JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.router.navigate(['/profile']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.isLoggedInKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getUserId(): string {
    const user = this.getUserFromLocalStorage();
    return user?.id || '';
  }

  isAuth(): boolean {
    return localStorage.getItem(this.isLoggedInKey) !== null;
  }

  isCollector(): boolean {
    const user = this.getUserFromLocalStorage();
    return user?.role === 'collecteur'; 
  }

  updateUser(updatedUser: User): void {
    console.log('Updating user:', updatedUser);

    const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
    console.log('Current users:', users);

    if (!Array.isArray(users)) {
      console.error('Users data is not an array. Initializing with an empty array.');
      localStorage.setItem(this.userKey, JSON.stringify([]));
      return;
    }

    const updatedUsers = users.map((user: User) => {
      if (user.id === updatedUser.id) {
        return updatedUser;
      }
      return user;
    });

    console.log('Updated users:', updatedUsers);

    localStorage.setItem(this.userKey, JSON.stringify(updatedUsers));
    localStorage.setItem(this.isLoggedInKey, JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
      const currentUser = this.getUserFromLocalStorage();
      const updatedUsers = users.filter((user: User) => user.id !== currentUser?.id);
      localStorage.setItem(this.userKey, JSON.stringify(updatedUsers));
      localStorage.removeItem(this.isLoggedInKey);
      this.currentUserSubject.next(null);
      this.router.navigate(['/register']);
    }
  }

  getUserAddress(): string {
    const user = this.getUserFromLocalStorage();
    return user?.address || '';
  }

  updateUserPoints(userId: string, points: number): void {
    const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === userId) {
        return { ...user, points: user.points + points };
      }
      return user;
    });
    localStorage.setItem(this.userKey, JSON.stringify(updatedUsers));
    this.currentUserSubject.next(updatedUsers.find((user: User) => user.id === userId));
  }

  updatePointsForValidatedRequests(userId: string): void {
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    alert(requests)
    let totalPoints = 0;

    const userRequests = requests.filter((request: Request) => request.userId === userId && request.status === 'Validated' && !request.isCalculated);
   alert(userRequests)
    userRequests.forEach((request: Request) => {
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
      request.isCalculated = true;
    });
    localStorage.setItem('requests' , JSON.stringify(requests));
    this.updateUserPoints(userId, totalPoints);
  }
  convertPointsToVoucher(userId: string, points: number): void {
    const users = JSON.parse(localStorage.getItem(this.userKey) || '[]');
    const user = users.find((u: User) => u.id === userId);
    if (user && user.points >= points) {
      user.points -= points;
      localStorage.setItem(this.userKey, JSON.stringify(users));
      this.currentUserSubject.next(user);
      alert(`You have successfully converted ${points} points into a voucher.`);
    } else {
      alert('You do not have enough points.');
    }
  }
}