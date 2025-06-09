import {Component, EventEmitter, inject, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';
import {UploadService} from '../../data/file-upload/services/upload.service';

@Component({
  selector: 'app-modal-upload-file',
  imports: [
    MatIcon,
    NgIf,
    NgClass,
  ],
  templateUrl: './modal-upload-file.component.html',
  styleUrl: './modal-upload-file.component.css'
})
export class ModalUploadFileComponent {
  @Output() close = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<string>();

  private uploadService = inject(UploadService);

  isDragOver = false;
  isErrorUpload = false;
  fileName: string | null = null;
  fileSelected: boolean = false;
  isFileUploaded = false;
  errorMessage: string | null = null;
  filePath: string | null = null;


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isExcelFile(file)) {
        this.errorMessage = null;
        this.fileName = file.name;
        this.fileSelected = true;
        this.handleFile(file);
        this.showMessageAndClose();
      } else {
        this.errorMessage = 'Можно загрузить только Excel-файл (.xls, .xlsx)';
        this.fileName = null;
        this.fileSelected = false;
      }
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isExcelFile(file)) {
        this.errorMessage = null;
        this.fileName = file.name;
        this.fileSelected = true;
        this.handleFile(file);
        this.showMessageAndClose();
      } else {
        this.errorMessage = 'Можно загрузить только Excel-файл (.xls, .xlsx)';
        this.fileName = null;
        this.fileSelected = false;
      }
    }
  }

  isExcelFile(file: File): boolean {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.xls', '.xlsx'];
    const fileName = file.name.toLowerCase();
    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.some(ext => fileName.endsWith(ext))
    );
  }

  showMessageAndClose() {
    this.isFileUploaded = true;
    setTimeout(() => this.onClose(), 4000); //таймер на закрытие модалки
  }

  onClose() {
    this.close.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }



  handleFile(file: File) {
    // Отправка файла на сервер
    this.uploadService.uploadExcelFile(file).subscribe({
      next: (response) => {
        this.isErrorUpload = false;
        this.isFileUploaded = true;
        this.filePath = 'Файл успешно обработан!';
        console.log(this.filePath);
        this.errorMessage = null;
        if (this.fileName) {
          this.fileUploaded.emit(this.fileName);
        }
      },
      error: (err) => {
        this.isFileUploaded = false;
        this.filePath = null;
        this.isErrorUpload = true;
        this.errorMessage = this.getFriendlyError(err);
        this.fileName = null;
        console.log(this.errorMessage);
      }
    });
  }

  getFriendlyError(err: any): string {
    // Ошибка соединения (сервер не запущен)
    if (err.status === 0 && err.message && err.message.includes('Http failure response')) {
      return 'Сервер недоступен. Проверьте, что сервер запущен и доступен по адресу http://localhost:8000.';
    }
    if (err?.error?.detail) {
      return 'Ошибка загрузки файла: ' + err.error.detail;
    }
    if (err?.message) {
      return 'Ошибка загрузки файла: ' + err.message;
    }
    return 'Неизвестная ошибка при загрузке файла.';
  }
}
