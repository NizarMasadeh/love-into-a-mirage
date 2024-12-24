import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IpLocationService {

  normalLocation: any;
  detailedLocation: any;
  userAgent: any;
  allUserData: any[] = [];

  constructor(
    private _httpClient: HttpClient
  ) { }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      );
    });
  }
  
  async trackUserVisit() {
    try {
      const position = await this.getCurrentPosition();
      const userData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      return this._httpClient.post(`${environment.server}ip-stuff/track`, userData).toPromise();
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to IP-based tracking if user denies permission
      return this._httpClient.post(`${environment.server}ip-stuff/track`, {}).toPromise();
    }
  }
  // getIpAdress(): Observable<any> {
  //   return this._httpClient.get(`${environment.IpUrl}`);
  // }

  // getAllUserSENdata(): Observable<any> {
  //   return this._httpClient.get<any>(`${environment.IpUrl}`).pipe(
  //     switchMap((ipRes) => {
  //       const ipAddress = ipRes.ip;

  //       return forkJoin({
  //         normalLocation: this._httpClient.get<any>(`${environment.locationByIp}${ipAddress}`),
  //         detailedLocation: this._httpClient.get<any>(`${environment.detailedLocation}${ipAddress}`),
  //         userAgent: this._httpClient.get<any>(`${environment.userAgent}`)
  //       });
  //     }),
  //     map((response) => {
  //       const allUserData = {
  //         ...response.normalLocation,
  //         ...response.detailedLocation,
  //         ...response.userAgent
  //       };
  //       return allUserData;
  //     })
  //   );
  // }

  // getIpLocation_SSR(): Observable<any> {
  //   return this._httpClient.get(`${environment.nzrm}ipLocation`);
  // }

  // getUserAgent(): Observable<any> {
  //   return this._httpClient.get(`${environment.userAgent}`);
  // }

  // sendData(data: any): Observable<any> {
  //   return this._httpClient.post(`${environment.nzrm}nzrm-users`, data);
  // }

}
