import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiConfigService} from '../../api-config/api-config.service';
import {Observable} from 'rxjs';
import {Product} from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private http = inject(HttpClient);
  private apiUrl = inject(ApiConfigService).baseUrl + '/product';

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/getall`);
  }

  getProductsBySubstring(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/getsubstring`, { params: { name } });
  }

  getProductsByCategories(categories: string[]): Observable<Product[]> {
    let params = new HttpParams();
    categories.forEach(cat => {
      params = params.append('categories', cat);
    });
    return this.http.get<Product[]>(`${this.apiUrl}/getbycategories`, { params });
  }
}
