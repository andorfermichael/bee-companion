import { Routes } from '@angular/router';

import { AuthGuard } from './@services/auth-guard.service';
import { AuthRoleGuard } from './@services/auth-role-guard.service';
import { NonAuthGuard } from './@services/non-auth-guard.service';

import { AboutUsComponent } from './about';
import { BeeRadarComponent } from './beeRadar';
import { CallbackComponent } from './callback';
import { ContactUsComponent } from './contact';
import { HomeComponent } from './home';
import { LoginPageComponent } from './login';
import { NoContentComponent } from './no-content';
import { PrivacyPolicyComponent } from './privacy';
import { RestrictedComponent } from './restricted';
import { SignupPageComponent } from './signup';
import { TermsAndConditionsComponent } from './terms';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'about', component: AboutUsComponent, pathMatch: 'full'},
  { path: 'bee-radar',  component: BeeRadarComponent, pathMatch: 'full'},
  { path: 'callback', component: CallbackComponent },
  { path: 'contact', component: ContactUsComponent, pathMatch: 'full'},
  { path: 'home',  component: HomeComponent, pathMatch: 'full'},
  { path: 'home/payment/:status', component: HomeComponent, pathMatch: 'full',
    canActivate: [AuthGuard]},
  { path: 'login', component: LoginPageComponent, pathMatch: 'full', canActivate: [NonAuthGuard]},
  { path: 'privacy', component: PrivacyPolicyComponent, pathMatch: 'full'},
  { path: 'restricted', component: RestrictedComponent, pathMatch: 'full',
    canActivate: [AuthRoleGuard]},
  { path: 'signup', component: LoginPageComponent, pathMatch: 'full'},
  { path: 'signup/complete', component: SignupPageComponent, pathMatch: 'full',
    canActivate: [AuthGuard]},
  { path: 'terms', component: TermsAndConditionsComponent, pathMatch: 'full'},
  { path: '**',    component: NoContentComponent }
];
