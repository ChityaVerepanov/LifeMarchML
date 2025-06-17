import {Component, ElementRef, EventEmitter, HostListener, inject, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-product-graph-modal',
  imports: [
    MatIcon,
    NgIf
  ],
  templateUrl: './product-graph-modal.component.html',
  styleUrl: './product-graph-modal.component.css'
})
export class ProductGraphModalComponent {
  @Input() product: any;
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Output() onClose = new EventEmitter<void>();

  isDragging = false;
  dragX = 0;
  dragY = 0;

  selectedGraph: 'revenue' | 'sales' | 'write-offs' = 'revenue';

  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onClose.emit();
    }
  }

  // Закрытие по Esc
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.onClose.emit();
  }

  startDrag(event: MouseEvent) {
    // Проверяем, что клик по верхней части модалки (например, по заголовку)
    if (!event.target) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.modal-header')) return;

    this.isDragging = true;
    this.dragX = event.clientX - this.left;
    this.dragY = event.clientY - this.top;
    // Отслеживаем движения мыши
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  // Перетаскивание: движение
  onMouseMove = (event: MouseEvent) => {
    if (!this.isDragging) return;
    this.left = event.clientX - this.dragX;
    this.top = event.clientY - this.dragY;
  };

  // Перетаскивание: конец
  onMouseUp = () => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  selectGraph(graph: 'revenue' | 'sales' | 'write-offs') {
    this.selectedGraph = graph;
  };
}
