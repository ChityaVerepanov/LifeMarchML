import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from '../../api-config/api-config.service';
import {Observable} from 'rxjs';
import {Product} from '../../product';

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
}
