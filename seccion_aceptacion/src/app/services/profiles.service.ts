import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  constructor(private api: ApiService) {}

  getProfiles(): Observable<any> {
    return this.api.get('users'); // Cambia 'users' si el endpoint es otro
  }

  acceptProfile(id: number) {
    return this.api.post(`matches`, { userId: id });
  }

  rejectProfile(id: number) {
    return this.api.post(`matches/reject`, { userId: id });
  }
}
