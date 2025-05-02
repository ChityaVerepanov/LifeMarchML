import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TuiDay, TuiDayRange} from '@taiga-ui/cdk';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {TuiInputDateRangeModule} from '@taiga-ui/legacy';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';


@Component({
  selector: 'app-calendar',
  imports: [
    FormsModule,
    TuiInputDateRangeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    }
  ]
})

export class CalendarComponent {
  protected readonly control = new FormControl(
    new TuiDayRange(TuiDay.currentLocal(), TuiDay.currentLocal()),
  );
}
