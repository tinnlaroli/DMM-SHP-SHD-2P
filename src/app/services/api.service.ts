import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://dmm-shp-shd-2p-production.up.railway.app/api';
  private storageInitialized = false;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private authService: AuthService // Properly injected AuthService
  ) {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      await this.storage.create();
      this.storageInitialized = true;
      console.log('Storage initialized successfully');
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  private async ensureStorageReady(): Promise<void> {
    if (!this.storageInitialized) {
      await this.initializeStorage();
    }
  }

  private async getAuthHeaders(): Promise<HttpHeaders> {
    await this.ensureStorageReady();
    
    const token = await this.storage.get('auth_token');
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get posts (public)
  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  // Create post (protected)
  createPost(postData: any): Observable<any> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.post(`${this.apiUrl}/posts`, postData, { headers });
      })
    );
  }

  // Get recommended profiles (protected)
  getProfiles(): Observable<any> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.get(`${this.apiUrl}/profiles`, { headers });
      })
    );
  }

  // Accept a profile (protected)
  acceptProfile(profileId: string): Observable<any> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.post(`${this.apiUrl}/profiles/${profileId}/accept`, {}, { headers });
      })
    );
  }

  // Reject a profile (protected)
  rejectProfile(profileId: string): Observable<any> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.post(`${this.apiUrl}/profiles/${profileId}/reject`, {}, { headers });
      })
    );
  }
}