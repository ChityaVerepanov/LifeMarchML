import {TuiRoot} from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CalendarComponent} from './common-ui/calendar/calendar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LifeMarchML';
}
