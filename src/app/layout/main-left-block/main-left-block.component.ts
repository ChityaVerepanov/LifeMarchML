import { Component } from '@angular/core';
import {CalendarComponent} from '../../common-ui/calendar/calendar.component';
import {FilterFoodComponent} from "../../common-ui/filter-food/filter-food.component";

@Component({
  selector: 'app-main-left-block',
    imports: [
        CalendarComponent,
        FilterFoodComponent
    ],
  templateUrl: './main-left-block.component.html',
  styleUrl: './main-left-block.component.css'
})
export class MainLeftBlockComponent {

}
