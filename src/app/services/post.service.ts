import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getFeed(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  createPost(postData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }
}
