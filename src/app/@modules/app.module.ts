import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,  ApplicationRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { Auth } from '../@services/auth.service';
import { AuthGuard } from '../@services/auth-guard.service';
import { AuthRoleGuard } from '../@services/auth-role-guard.service';
import { NonAuthGuard } from '../@services/non-auth-guard.service';
import { EventsService } from '../@services/events.service';

import { AuthModule } from './auth.module';

// Import Google Maps
import { AgmCoreModule } from '@agm/core';

// Import Web Storage
import { Ng2Webstorage } from 'ngx-webstorage';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from '../environment';
import { ROUTES } from '../app.routes';

// App is our top level component
import { AppComponent } from '../app.component';
import { APP_RESOLVER_PROVIDERS } from '../app.resolver';

// Second level components
import { AboutUsComponent } from '../about';
import { BeeRadarComponent } from '../beeRadar';
import { CallbackComponent } from '../callback';
import { ContactUsComponent } from '../contact';
import { FooterComponent } from '../+footer';
import { HeaderComponent } from '../+header';
import { HomeComponent } from '../home';
import { LoginCardComponent } from '../+loginCard';
import { LoginPageComponent } from '../login';
import { MainCardComponent } from '../+mainCard';
import { MainContentComponent } from '../+mainContent';
import { MainContentRowComponent } from '../+mainContentRow';
import { NavComponent } from '../+nav';
import { NoContentComponent } from '../no-content';
import { PayPalFormComponent } from '../+paypalForm';
import { PrivacyPolicyComponent } from '../privacy';
import { RadarCardComponent } from '../+radarCard';
import { RestrictedComponent } from '../restricted';
import { SignupCardComponent } from '../+signupCard';
import { SignupPageComponent } from '../signup';
import { TermsAndConditionsComponent } from '../terms';

// Styles
import '../../styles/styles.scss';
import '../../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AboutUsComponent,
    AppComponent,
    BeeRadarComponent,
    CallbackComponent,
    ContactUsComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginCardComponent,
    LoginPageComponent,
    MainCardComponent,
    MainContentComponent,
    MainContentRowComponent,
    NavComponent,
    NoContentComponent,
    PayPalFormComponent,
    PrivacyPolicyComponent,
    RadarCardComponent,
    RestrictedComponent,
    SignupCardComponent,
    SignupPageComponent,
    TermsAndConditionsComponent
  ],
  imports: [ // import Angular's modules
    AgmCoreModule.forRoot({ apiKey: process.env.GOOGLE_MAPS_API_KEY }),
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2Webstorage,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    Auth,
    AuthGuard,
    AuthRoleGuard,
    NonAuthGuard,
    EventsService
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
}
