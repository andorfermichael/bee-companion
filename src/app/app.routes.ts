import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutUsComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: '**',    component: NoContentComponent },
];
