import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NgClass, NgIf} from '@angular/common';

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
  isDragOver = false;
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
        this.showSuccessAndClose();
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
        this.showSuccessAndClose();
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

  showSuccessAndClose() {
    this.isFileUploaded = true;
    if (this.fileName) {
      this.fileUploaded.emit(this.fileName);
    }
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
    // @ts-ignore
    this.filePath = window.electronAPI?.getPathForFile?.(file) || null;
  }
}
