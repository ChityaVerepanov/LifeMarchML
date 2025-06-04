import { Component } from '@angular/core';
import {CalendarComponent} from '../../common-ui/calendar/calendar.component';
import {FilterFoodComponent} from "../../common-ui/filter-food/filter-food.component";
import {ModalUploadFileComponent} from '../../common-ui/modal-upload-file/modal-upload-file.component';
import {NgClass, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-main-left-block',
  imports: [
    CalendarComponent,
    FilterFoodComponent,
    ModalUploadFileComponent,
    NgIf,
    MatIcon,
    NgClass
  ],
  templateUrl: './main-left-block.component.html',
  styleUrl: './main-left-block.component.css'
})
export class MainLeftBlockComponent {
  showModal = false;
  uploadedFileName: string | null = null;

  onFileUploaded(fileName: string) {
    this.uploadedFileName = fileName;
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
