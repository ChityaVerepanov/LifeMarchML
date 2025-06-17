import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Product} from '../../data/table/interfaces/product';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableService} from '../../data/table/services/table.service';
import {debounceTime, distinctUntilChanged, Observable, Subject} from 'rxjs';
import {CategoryFilterService} from '../../data/connect-categories-table/category-filter.service';
import {ProductGraphModalComponent} from '../product-graph-modal/product-graph-modal.component';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-product-table',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DecimalPipe,
    ProductGraphModalComponent,
    MatIcon
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private searchSubject = new Subject<string>();
  private tableService = inject(TableService);
  private categoryFilterService = inject(CategoryFilterService);

  searchQuery: string = '';
  searchActive = false;
  isDragging = false;
  dragValue = false;
  dragStarted = false;

  showModal: boolean = false;
  modalProduct: any = null;
  modalTop: number = 0;
  modalLeft: number = 0;

  checkedMap: Record<number, boolean> = {};
  products : Product[] = [];
  allProducts: Product[] = [];
  selectedCategories: string[] = [];
  categoryFilteredProducts: Product[] = []

  ngOnInit() {
    this.categoryFilterService.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.applyFilters();
    });

    this.tableService.getAllProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.products = data.map(p => ({
          ...p,
          checked: this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true
        }));
      },
      error: (err) => {
        this.products = [];
        this.allProducts = [];
      }
    });

    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.applyFilters();
    });
  }

  get isCategoryFilterActive(): boolean {
    return this.selectedCategories && this.selectedCategories.length > 0;
  }

  applyFilters() {
    const categories = this.selectedCategories;
    const search = this.searchQuery.trim().toLowerCase();

    let source$: Observable<Product[]>;
    if (!categories || categories.length === 0) {
      source$ = this.tableService.getAllProducts();
    } else {
      source$ = this.tableService.getProductsByCategories(categories);
    }

    source$.subscribe(data => {
      // Сохраняем все товары после фильтра по категориям
      this.categoryFilteredProducts = data.map(p => ({
        ...p,
        checked: this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true
      }));

      // Применяем поиск только для отображения
      let filtered = this.categoryFilteredProducts;
      if (search) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(search)
        );
      }
      this.products = filtered;
    });
  }

  onCategoriesChanged(categories: string[]) {
    this.selectedCategories = categories;
    this.tableService.getProductsByCategories(categories).subscribe(data => {
      this.products = data.map(p => ({
        ...p,
        checked: this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true
      }));
    });
  }

  onCheckboxClick(event: MouseEvent, product: any) {
    if (!this.isDragging) {
      product.checked = !product.checked;
      this.checkedMap[product.id] = product.checked;
    } else {
      event.preventDefault();
    }
  }

  onCheckboxMouseDown(event: MouseEvent, product: any) {
    if (event.button !== 0) return; // Только левая кнопка мыши
    this.dragStarted = true;
    // Слушаем mousemove на документе для отслеживания drag
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onCheckboxMouseUp);
  }

  onCheckboxMouseEnter(event: MouseEvent, product: any) {
    if (this.isDragging) {
      product.checked = this.dragValue;
    }
  }

  onDocumentMouseMove = (event: MouseEvent) => {
    if (this.dragStarted && !this.isDragging) {
      // Первый mousemove после mousedown - активируем drag
      this.isDragging = true;
      // Определяем, какое значение выставлять (по первому наведённому чекбоксу)
      // Получаем элемент под курсором
      const target = event.target as HTMLInputElement;
      if (target && target.tagName === 'INPUT' && target.type === 'checkbox') {
        const ngModel = target.getAttribute('ng-reflect-model');
        this.dragValue = ngModel !== 'true';
        // Выставляем значение первому чекбоксу
        (target as HTMLInputElement).checked = this.dragValue;
      }
    }
  };

  onCheckboxMouseUp = () => {
    this.isDragging = false;
    this.dragStarted = false;
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onCheckboxMouseUp);
  };

  endCheckboxDrag = () => {
    this.isDragging = false;
    document.removeEventListener('mouseup', this.endCheckboxDrag);
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  ngAfterViewChecked() {
    if (this.searchActive && this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      this.searchActive = false;
      this.searchQuery = '';
      this.applyFilters();
    }
  }

  get filteredProducts() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      return this.products;
    }
    return this.products.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  }

  get totalQuantity(): number {
    return this.categoryFilteredProducts
      .filter(p => this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true)
      .reduce((sum, p) => sum + (p.quantityBuy || 0), 0);
  }

  get totalPrice(): number {
    return this.categoryFilteredProducts
      .filter(p => this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true)
      .reduce((sum, p) => sum + (p.costPrice || 0), 0);
  }

  onGraphButtonClick(event: MouseEvent, product: any) {
    event.stopPropagation(); // чтобы не срабатывали другие клики
    this.modalProduct = product;
    this.showModal = true;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.modalTop = rect.top + window.scrollY;
    this.modalLeft = rect.left + rect.width - 700;
  }

  closeModal() {
    this.showModal = false;
    this.modalProduct = null;
  }
}
