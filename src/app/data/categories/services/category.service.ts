import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'api/categories'; //http://localhost:8080/api/categories

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/findall`);
  }

  searchByName(name: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/name/${encodeURIComponent(name)}`);
  }
}
