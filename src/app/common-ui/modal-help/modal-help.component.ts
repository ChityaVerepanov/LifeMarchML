import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-modal-help',
  imports: [
    MatIcon,
  ],
  templateUrl: './modal-help.component.html',
  styleUrl: './modal-help.component.css'
})
export class ModalHelpComponent {

  @Output() close = new EventEmitter<void>();
}
