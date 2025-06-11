import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryFilterService {
  private selectedCategoriesSubject = new BehaviorSubject<string[]>([]);
  selectedCategories$: Observable<string[]> = this.selectedCategoriesSubject.asObservable();

  setSelectedCategories(categories: string[]) {
    this.selectedCategoriesSubject.next(categories);
  }

  getSelectedCategories(): string[] {
    return this.selectedCategoriesSubject.getValue();
  }
}
