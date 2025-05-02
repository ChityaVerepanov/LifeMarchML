import { Routes } from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';

export const routes: Routes = [
  {path: ``, component: MainPageComponent},
  {path: `**`, component: MainPageComponent},
];
