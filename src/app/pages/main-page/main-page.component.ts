import { Component } from '@angular/core';
import {MainLeftBlockComponent} from '../../layout/main-left-block/main-left-block.component';
import {MainRightBlockComponent} from '../../layout/main-right-block/main-right-block.component';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {ModalHelpComponent} from '../../common-ui/modal-help/modal-help.component';

@Component({
  selector: 'app-main-page',
  imports: [
    MainLeftBlockComponent,
    MainRightBlockComponent,
    MatIcon,
    NgIf,
    ModalHelpComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  showHelp = false;

  closeHelp() {
    this.showHelp = false;
  }
}
