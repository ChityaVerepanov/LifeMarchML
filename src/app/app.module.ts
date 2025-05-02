import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppComponent
  ],
  providers: [
    {
      provide: TUI_LANGUAGE,
      useValue: TUI_RUSSIAN_LANGUAGE
    }
  ]
})

export class AppModule { }
