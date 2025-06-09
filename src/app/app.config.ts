import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';

import { routes } from './app.routes';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {of} from 'rxjs';
import {provideHttpClient} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideEventPlugins(),
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
    provideHttpClient(),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
  ]
};
