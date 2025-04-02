import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dmm-shp-shd-2p-production.up.railway.app/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuthState();
  }

  // Headers optimizados para CORS
  private getHeaders(withAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    if (withAuth) {
      const token = this.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
  
    return headers;
  }

  private initializeAuthState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.tokenSubject.next(token);
      this.authStatusSubject.next(true);
      this.setAutoLogout(this.getTokenExpiration(token));
    } else {
      this.clearAuthData();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      { headers: this.getHeaders(false) } // Sin token para login inicial
    ).pipe(
      tap((res: any) => {
        this.handleAuthentication(res.token, res.expiresIn || 3600);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login'], {
      queryParams: { logout: 'success' }
    });
  }

  private handleAuthentication(token: string, expiresIn: number): void {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    ).toISOString();

    localStorage.setItem('token', token);
    localStorage.setItem('token_expiration', expirationDate);

    this.tokenSubject.next(token);
    this.authStatusSubject.next(true);
    this.setAutoLogout(expiresIn * 1000);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    
    this.tokenSubject.next(null);
    this.authStatusSubject.next(false);
  }

  private setAutoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private getTokenExpiration(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = new Date(payload.exp * 1000).getTime();
      const now = new Date().getTime();
      return expiration - now;
    } catch {
      return 0;
    }
  }

  private isTokenExpired(token: string): boolean {
    const expiration = localStorage.getItem('token_expiration');
    if (!expiration) return true;

    return new Date() > new Date(expiration);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error de conexión';
    const errorData = error.error?.errors || error.error?.message || error.message;

    if (error.status === 0) {
      errorMessage = 'Error de conexión con el servidor';
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
      this.clearAuthData();
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para esta acción';
    } else if (errorData) {
      errorMessage = typeof errorData === 'string' ? errorData : 
                    Object.values(errorData).join(', ');
    }

    return throwError(() => new Error(errorMessage));
  }

  // Métodos públicos
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  getTokenObservable(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/refresh`,
      {}, 
      { headers: this.getHeaders() }
    ).pipe(
      tap((res: any) => {
        this.handleAuthentication(res.token, res.expiresIn);
      }),
      catchError(this.handleError)
    );
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-info`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}