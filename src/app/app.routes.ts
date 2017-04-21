import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutUsComponent } from './about';
import { ContactUsComponent } from './contact';
import { BeeRadarComponent } from './beeRadar';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
  	{ path: 'home',  component: HomeComponent, pathMatch: 'full'},
  	{ path: 'bee-radar',  component: BeeRadarComponent, pathMatch: 'full'},
  	{ path: 'about', component: AboutUsComponent, pathMatch: 'full'},
  	{ path: 'contact', component: ContactUsComponent, pathMatch: 'full'},
  	{ path: '**',    component: NoContentComponent },
];
