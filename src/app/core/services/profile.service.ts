import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  baseUrl = 'http://shopbag.runasp.net/api/Identity/Profiles';

  getProfile(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateProfile(profileData: any, id: number) {
    return this.http.put(`${this.baseUrl}/${id}`, profileData);
  }
}
