import { Routes } from '@angular/router';

import { AuthGuard } from './@services/auth-guard.service';
import { AuthRoleGuard } from './@services/auth-role-guard.service';
import { NonAuthGuard } from './@services/non-auth-guard.service';

import { AboutUsComponent } from './@pages/about';
import { BeeRadarComponent } from './@pages/beeRadar';
import { CallbackComponent } from './@pages/callback';
import { ContactUsComponent } from './@pages/contact';
import { HomeComponent } from './@pages/home';
import { LoginPageComponent } from './@pages/login';
import { NoContentComponent } from './@pages/no-content';
import { PrivacyPolicyComponent } from './@pages/privacy';
import { RestrictedComponent } from './@pages/restricted';
import { SignupPageComponent } from './@pages/signup';
import { TermsAndConditionsComponent } from './@pages/terms';
import { UserPageComponent } from './@pages/user';

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
  { path: 'signup', component: LoginPageComponent, pathMatch: 'full', canActivate: [NonAuthGuard]},
  { path: 'signup/complete', component: SignupPageComponent, pathMatch: 'full',
    canActivate: [AuthGuard]},
  { path: 'terms', component: TermsAndConditionsComponent, pathMatch: 'full'},
  { path: 'user/me', component: UserPageComponent, pathMatch: 'full'},
  { path: '**',    component: NoContentComponent }
];
