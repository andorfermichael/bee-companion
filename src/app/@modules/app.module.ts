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

// External Services
import { AgmCoreModule, GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { Ng2Webstorage } from 'ngx-webstorage';

// Internal Services
import { GeolocationService } from '../@services/geolocation.service';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from '../environment';
import { ROUTES } from '../app.routes';

import { MarkerClusterDirective } from '../@directives/marker-cluster.directive';

// App is our top level component
import { AppComponent } from '../app.component';
import { APP_RESOLVER_PROVIDERS } from '../app.resolver';

// Second level components
// @pages
import { HomeComponent } from '../@pages/home';
import { BeeRadarComponent } from '../@pages/beeRadar';
import { AboutUsComponent } from '../@pages/about';
import { RestrictedComponent } from '../@pages/restricted';
import { LoginPageComponent } from '../@pages/login';
import { SignupPageComponent } from '../@pages/signup';
import { CallbackComponent } from '../@pages/callback';
import { ContactUsComponent } from '../@pages/contact';
import { TermsAndConditionsComponent } from '../@pages/terms';
import { PrivacyPolicyComponent } from '../@pages/privacy';
import { NoContentComponent } from '../@pages/no-content';
import { UserPageComponent } from '../@pages/user';
// @elements
import { BeeMapComponent } from '../@elements/+beeMap';
import { FooterComponent } from '../@elements/+footer';
import { HeaderComponent } from '../@elements/+header';
import { LoginCardComponent } from '../@elements/+loginCard';
import { MainCardComponent } from '../@elements/+mainCard';
import { MainContentComponent } from '../@elements/+mainContent';
import { MainContentRowComponent } from '../@elements/+mainContentRow';
import { NavComponent } from '../@elements/+nav';
import { SideNavComponent } from '../@elements/+sidenav';
import { AdminMenuComponent } from '../@elements/+adminMenu';
import { BeekeeperMenuComponent } from '../@elements/+beekeeperMenu';
import { SupporterMenuComponent } from '../@elements/+supporterMenu';
import { PayPalFormComponent } from '../@elements/+paypalForm';
import { RadarCardComponent } from '../@elements/+radarCard';
import { SignupCardComponent } from '../@elements/+signupCard';
import { UserProfileComponent } from '../@elements/+userProfile';

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
    // Components
    AboutUsComponent,
    AdminMenuComponent,
    AppComponent,
    BeeMapComponent,
    BeekeeperMenuComponent,
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
    SideNavComponent,
    NoContentComponent,
    PayPalFormComponent,
    PrivacyPolicyComponent,
    RadarCardComponent,
    RestrictedComponent,
    SignupCardComponent,
    SignupPageComponent,
    TermsAndConditionsComponent,
    SupporterMenuComponent,
    TermsAndConditionsComponent,
    UserPageComponent,
    UserProfileComponent,
    // Directives
    MarkerClusterDirective
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
    EventsService,
    GeolocationService,
    MarkerManager,
    GoogleMapsAPIWrapper
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
}
