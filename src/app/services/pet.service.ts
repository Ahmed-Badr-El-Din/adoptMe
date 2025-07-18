import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PetService {
  private apiUrl = 'https://api.petfinder.com/v2';
  private clientId = 'H5hkIxhiX1aofnKGM7GsDjhPOW0ZCW4bpDmFLuJvFOBLSPSuCv'; // Replace with your key
  private clientSecret = 'KCfv1JArVkS2VQ7mOpdnTgT6OAGq9Tl9oy3sh0c1'; // Replace with your secret

  private tokenKey = 'petfinder_token';
  private tokenExpiryKey = 'petfinder_token_expires';

  constructor(private http: HttpClient) {}

  // ✅ Get or Refresh Token with Expiry Check
  private getToken(): Observable<string> {
    const token = localStorage.getItem(this.tokenKey);
    const expiresAt = Number(localStorage.getItem(this.tokenExpiryKey)) || 0;

    if (token && Date.now() < expiresAt) {
      return of(token);
    }

    return this.http.post<any>(`${this.apiUrl}/oauth2/token`, {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    }).pipe(
      tap(res => {
        const expiresInMs = res.expires_in * 1000;
        localStorage.setItem(this.tokenKey, res.access_token);
        localStorage.setItem(this.tokenExpiryKey, (Date.now() + expiresInMs).toString());
      }),
      map(res => res.access_token)
    );
  }

  // ✅ Fetch Pets with Authorization
getPets(options?: { page?: number, type?: string, gender?: string }): Observable<any> {
  return this.getToken().pipe(
    switchMap(token => {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      let params = new HttpParams()
        .set('limit', 12)
        .set('location', 'CA')
        .set('sort', 'recent')
        .set('page', options?.page?.toString() || '1');

      if (options?.type) params = params.set('type', options.type);
      if (options?.gender) params = params.set('gender', options.gender);

      return this.http.get(`${this.apiUrl}/animals`, { headers, params });
    })
  );
}


  // 🔁 LocalStorage User-Key Helper
  private getUserKey(type: 'favorites' | 'adopted', userId: string): string {
    return `${type}_${userId}`;
  }

  // ✅ Toggle Favorite
  toggleFavorite(userId: string, petId: number): void {
    const key = this.getUserKey('favorites', userId);
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const strId = petId.toString();
    const index = list.indexOf(strId);

    if (index >= 0) list.splice(index, 1);
    else list.push(strId);

    localStorage.setItem(key, JSON.stringify(list));
  }

  getFavorites(userId: string): string[] {
    const key = this.getUserKey('favorites', userId);
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  isFavorite(userId: string, petId: number): boolean {
    return this.getFavorites(userId).includes(petId.toString());
  }

  removeAdopted(userId: string, petId: number): void {
  const key = `adopted_${userId}`;
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = list.filter((id: string) => id !== petId.toString());
  localStorage.setItem(key, JSON.stringify(updated));
}

  // ✅ Adopt Pet
  adoptPet(userId: string, petId: number): void {
    const key = this.getUserKey('adopted', userId);
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const strId = petId.toString();

    if (!list.includes(strId)) {
      list.push(strId);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }

  getAdopted(userId: string): string[] {
    const key = this.getUserKey('adopted', userId);
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  isAdopted(userId: string, petId: number): boolean {
    return this.getAdopted(userId).includes(petId.toString());
  }
}
