import { Component } from '@angular/core';
import {MainLeftBlockComponent} from '../../layout/main-left-block/main-left-block.component';
import {MainRightBlockComponent} from '../../layout/main-right-block/main-right-block.component';

@Component({
  selector: 'app-main-page',
  imports: [
    MainLeftBlockComponent,
    MainRightBlockComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
}
