import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgModule,
  ApplicationRef,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import { Auth } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { AuthRoleGuard } from './auth-role-guard.service';
import { NonAuthGuard } from './non-auth-guard.service';
import { EventsService } from './events.service';

import { AuthModule } from './auth.module';

// Import Google Maps
import { AgmCoreModule } from '@agm/core';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { HomeComponent } from './home';
import { AboutUsComponent } from './about';
import { ContactUsComponent } from './contact';
import { TermsAndConditionsComponent } from './terms';
import { LoginPageComponent } from './login';
import { LoginCardComponent } from './+loginCard';
import { SignupPageComponent } from './signup';
import { SignupCardComponent } from './+signupCard';
import { PrivacyPolicyComponent } from './privacy';
import { BeeRadarComponent } from './beeRadar';
import { NavComponent } from './+nav';
import { HeaderComponent } from './+header';
import { FooterComponent } from './+footer';
import { MainCardComponent } from './+mainCard';
import { MainContentComponent } from './+mainContent';
import { MainContentRowComponent } from './+mainContentRow';
import { RadarCardComponent } from './+radarCard';
import { CallbackComponent } from './callback';
import { RestrictedComponent } from './restricted';
import { NoContentComponent } from './no-content';

import '../styles/styles.scss';
import '../styles/headings.css';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS
];

// interface StoreType {
//   state: InternalStateType;
//   restoreInputValues: () => void;
//   disposeOldHosts: () => void;
// }

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutUsComponent,
    ContactUsComponent,
    TermsAndConditionsComponent,
    LoginPageComponent,
    LoginCardComponent,
    SignupPageComponent,
    SignupCardComponent,
    PrivacyPolicyComponent,
    HomeComponent,
    BeeRadarComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    MainCardComponent,
    MainContentComponent,
    MainContentRowComponent,
    CallbackComponent,
    RestrictedComponent,
    RadarCardComponent,
    NoContentComponent
  ],
  imports: [ // import Angular's modules
    AuthModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzRGKSl4vUt5C9ub3tvpIysxcuBeJbUJg'
    })
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

  constructor(
    public appRef: ApplicationRef
  ) {}
}
