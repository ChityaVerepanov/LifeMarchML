import {Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, SimpleChanges} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {ChartsService} from '../../data/charts-products/services/charts.service';
import {ResponseChart} from '../../data/charts-products/interfaces/response-chart';
import { BaseChartDirective } from 'ng2-charts';
import {ChartType} from 'chart.js';
import {map} from 'rxjs';

@Component({
  selector: 'app-product-graph-modal',
  imports: [
    MatIcon,
    NgIf,
    BaseChartDirective
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
  writeOffData: ResponseChart[] = [];
  revenueData: ResponseChart[] = [];
  salesCountData: ResponseChart[] = [];

  selectedGraph: 'revenue' | 'sales' | 'write-offs' = 'revenue';

  private elementRef = inject(ElementRef);
  private chartsService = inject(ChartsService);

  // Настройки графика
  chartType: ChartType = 'line';
  chartData: any[] = [];
  chartLabels: string[] = [];
  chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Дата'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Значение'
        }
      }
    }
  };
  chartColors = [
    {
      borderColor: '#0d775d',
      backgroundColor: 'rgba(76, 175, 80, 0.1)'
    }
  ];

  ngOnInit() {
    if (this.product?.name) {
      this.loadGraphData(this.product.name);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product?.name) {
      this.loadGraphData(this.product.name);
    }
  }

  loadGraphData(name: string) {
    this.chartsService.getWriteOffHistory(name).subscribe(data => {
      this.writeOffData = data;
      this.updateChart();
      console.log(this.writeOffData);
    });
    this.chartsService.getRevenueHistory(name).subscribe(data => {
      this.revenueData = data;
      this.updateChart();
      console.log(this.revenueData);
    });
    this.chartsService.getSalesCountHistory(name).subscribe(data => {
      this.salesCountData = data;
      this.updateChart();
      console.log(this.salesCountData);
    });
  }

  getLastNValues(data: ResponseChart[], n: number = 5): ResponseChart[] {
    return data.length > n ? data.slice(-n) : data;
  }

  updateChart() {
    let data: ResponseChart[] = [];
    let valueField: string = '';
    switch (this.selectedGraph) {
      case 'revenue':
        data = this.revenueData;
        valueField = 'revenue';
        break;
      case 'sales':
        data = this.salesCountData;
        valueField = 'countSales';
        break;
      case 'write-offs':
        data = this.writeOffData;
        valueField = 'writeOffCount';
        break;
    }
    // Берём только последние 5 значений
    data = this.getLastNValues(data, 5);
    this.chartLabels = data.map(item => item.date);
    this.chartData = [
      {
        data: data.map(item => item[valueField as keyof ResponseChart] ?? 0),
        label: this.selectedGraph === 'revenue' ? 'Выручка (руб)' :
          this.selectedGraph === 'sales' ? 'Кол-во продаж' : 'Списания',
        borderColor: this.chartColors[0].borderColor,
        backgroundColor: this.chartColors[0].backgroundColor,
        fill: true,
        tension: 0.2,
      }
    ];
  }





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
    this.updateChart();
  }
}
