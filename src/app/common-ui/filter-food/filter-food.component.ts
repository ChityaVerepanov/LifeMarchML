import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Category} from '../../data/categories/interfaces/category';
import {CategoryService} from '../../data/categories/services/category.service';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from 'rxjs';

@Component({
  selector: 'app-filter-food',
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './filter-food.component.html',
  styleUrl: './filter-food.component.css'
})
export class FilterFoodComponent {
  searchQuery: string = '';
  searchActive = false;
  items: (Category & { checked: boolean })[] = [];
  private checkedStates: { [id: number]: boolean } = {};
  private searchSubject = new Subject<string>();
  errorMessage: string | null = null;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;


  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadInitialData();
    this.setupSearch();
  }

  private loadInitialData() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.items = this.mapCategories(categories);
    });
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => query
        ? this.categoryService.searchByName(query)
        : this.categoryService.getAllCategories()
      )
    ).subscribe(categories => {
      this.items = this.mapCategories(categories);
    });
  }

  private mapCategories(categories: Category[]) {
    return categories.map(category => ({
      ...category,
      checked: this.checkedStates[category.id] ?? true
    }));
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery.trim());
  }

  onCheckboxChange(item: Category & { checked: boolean }) {
    this.checkedStates[item.id] = item.checked;
  }

  toggleSearch(){
    this.searchActive = !this.searchActive;
  }

  get filteredItems() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.items;
    }
    return this.items.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }

  ngAfterViewChecked() {
    if (this.searchActive && this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.searchActive = false;
    }
  }
}
