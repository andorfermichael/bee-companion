import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth-guard.service';

import { HomeComponent } from './home';
import { AboutUsComponent } from './about';
import { ContactUsComponent } from './contact';
import { TermsAndConditionsComponent } from './terms';
import { LoginPageComponent } from './login';
import { PrivacyPolicyComponent } from './privacy';
import { BeeRadarComponent } from './beeRadar';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
  	{ path: 'home',  component: HomeComponent, pathMatch: 'full'},
  	{ path: 'bee-radar',  component: BeeRadarComponent, pathMatch: 'full'},
  	{ path: 'about', component: AboutUsComponent, pathMatch: 'full'},
  	{ path: 'terms', component: TermsAndConditionsComponent, pathMatch: 'full'},
  	{ path: 'privacy', component: PrivacyPolicyComponent, pathMatch: 'full'},
  	{ path: 'contact', component: ContactUsComponent, pathMatch: 'full'},
    { path: 'login', component: LoginPageComponent, pathMatch: 'full'},
  	{ path: 'signup', component: LoginPageComponent, pathMatch: 'full'},
  	{ path: 'restricted', component: LoginPageComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  	{ path: '**',    component: NoContentComponent },
];
