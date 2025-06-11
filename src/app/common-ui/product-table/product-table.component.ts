import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Product} from '../../data/product';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TableService} from '../../data/table/services/table.service';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-product-table',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DecimalPipe
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private searchSubject = new Subject<string>();
  private tableService = inject(TableService);

  searchQuery: string = '';
  searchActive = false;
  isDragging = false;
  dragValue = false;
  dragStarted = false;

  checkedMap: Record<number, boolean> = {};
  products : Product[] = [];

  ngOnInit() {
    this.tableService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => ({
          ...p,
          checked: this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true
        }));

      },
      error: (err) => {
        // обработка ошибки
        this.products = [];
      }
    });

    // Подписка на изменения поискового запроса
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim().length === 0) {
        // Если строка пустая — вернуть все товары
        this.tableService.getAllProducts().subscribe(data => {
          this.products = data.map(p => ({ ...p, checked: true }));
        });
      } else {
        this.tableService.getProductsBySubstring(query).subscribe(data => {
          this.products = data.map(p => ({ ...p, checked: true }));
        });
      }
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
      // Сброс поиска и повторная загрузка всех товаров с сохранением состояния чекбоксов
      this.tableService.getAllProducts().subscribe(data => {
        this.products = data.map(p => ({
          ...p,
          checked: this.checkedMap[p.id] !== undefined ? this.checkedMap[p.id] : true
        }));
      });
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
    const checkedProducts = this.products.filter(p => p.checked);
    return checkedProducts.length === 0
      ? 0
      : checkedProducts.reduce((sum, p) => sum + (p.quantityBuy || 0), 0);
  }

  get totalPrice(): number {
    return this.products
      .filter(product => product.checked)
      .reduce((sum, product) => sum + (product.costPrice || 0), 0);
  }
}
