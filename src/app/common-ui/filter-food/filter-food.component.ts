import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

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


  items = [
    { name: 'Готовая еда', checked: true },
    { name: 'Напитки', checked: true },
    { name: 'Бакалея', checked: true },
    { name: 'ХБИ', checked: true },
    { name: 'Бар', checked: true },
    { name: 'Бар', checked: true },
    { name: 'Бар', checked: true },
    { name: 'Бар', checked: true },
    { name: 'Бар', checked: true },
    { name: 'Мясо', checked: true },
    { name: 'Молочные продукты', checked: true },
    { name: 'Сэндвичи', checked: true },
    { name: 'Горячие напитки', checked: true }
  ];
}
