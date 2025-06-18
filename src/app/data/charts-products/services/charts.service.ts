import {inject, Injectable } from '@angular/core';
import {ApiConfigService} from '../../api-config/api-config.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseChart} from '../interfaces/response-chart';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private apiConfig = inject(ApiConfigService);
  private http = inject(HttpClient);

  private apiUrl = this.apiConfig.baseUrl + '/history';

  getWriteOffHistory(name: string): Observable<ResponseChart[]> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<ResponseChart[]>(`${this.apiUrl}/getwriteoff/${encodedName}`);
  }

  getRevenueHistory(name: string): Observable<ResponseChart[]> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<ResponseChart[]>(`${this.apiUrl}/getrevenue/${encodedName}`);
  }

  getSalesCountHistory(name: string): Observable<ResponseChart[]> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<ResponseChart[]>(`${this.apiUrl}/getcountsales/${encodedName}`);
  }
}
