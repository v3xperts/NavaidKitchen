import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule, FileDropDirective } from 'ng2-file-upload';

import { AgmCoreModule } from "angular2-google-maps/core";
import { ReCaptchaModule } from 'angular2-recaptcha';
import { TinymceModule } from 'angular2-tinymce';
import { AppComponent } from './app.component';
import { routing }        from './app.routing';
import { HeaderComponent,HeaderownerComponent,HeaderfrontendComponent,FooterfrontendComponent, HeaderOwnerReportComponent} from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent,ForgetComponent,ResetPasswordAdminComponent } from './login/login.component';
import { AlertComponent } from './directives/index';
import { AlertService, AuthService, UsersService, RatingService, PageService, PaymentConfigService,DeliveryChargesService, MasterService, KitchenService, KitchenMenuService,KitchenItemService,FrontendService, WeekMonthService, ComboService, OfferService, ReferralService, CustomerReferralService, FrontendRestaurantService, OrderService, SlidesService, IntroService, DriverService, LocalJsonService} from './service/index';
import { AuthGuard,OwnerAuthGuard } from './guards/index';
import { DashboardComponent, DashboardprofileComponent, DashboardsettingComponent} from './dashboard/dashboard.component';
import { PasswordComponent,PasswordComplexityComponent, PasswordChangeComponent } from './passwordcomplexity/password.component';
import { UsersComponent, UsersupdateComponent, UsersaddComponent,OwnerpartnerupdateComponent} from './users/index';
import {SelectModule} from 'ng2-select';
import {OrderPipe} from "./order.pipe"
import {FilterPipe} from "./filter.pipe";
import {SearchPipe} from "./filter2.pipe";
import {SearchPipek} from "./filter3.pipe";
import {SearchPipeRestaurant} from "./filter4.pipe";
import {EllipsisPipe} from "./ellipsis.pipe";
import { PageComponent,PagelistComponent,PageaddComponent,PageupdateComponent } from './page/page.component';
import { OwnerComponent,KitchenDocumentComponent,OwnermailactivateComponent,OwnerpartnermailactivateComponent , OwnerloginComponent, OwnerregisterComponent, OwnerprofileComponent, OwnerchangepasswordComponent, KitchenupdateComponent, KitchenupdatelocationComponent , ForgetOwnerComponent,ResetPasswordOwnerComponent,OwnerKitchenServicesComponent,OwnerTaxComponent, OwnerActivateOfferingComponent, OwnerRestaurantBasicComponent ,OwnerMenuSetupComponent, OwnerBonusPointComponent,OwnerMyDriverComponent, KictchenPolicyComponent} from './owner/owner.component';
import { CityComponent,CitylistComponent, CityaddComponent, CityupdateComponent } from './city/city.component';
import { CountryComponent,CountrylistComponent, CountryaddComponent, CountryupdateComponent } from './country/country.component';
import { LanguageComponent,LanguagelistComponent, LanguageaddComponent, LanguageupdateComponent } from './language/language.component';
import { CuisinesComponent,CuisineslistComponent, CuisinesaddComponent, CuisinesupdateComponent } from './cuisines/cuisines.component'
import { KitchenComponent,KitchenlistComponent,KitchenaddComponent,KitchenupdateadminComponent,KitchensPolicySettingComponent, KitchenServicesSettingComponent, KitchenServicesOrderListComponent} from './kitchen/kitchen.component';
import { KitchenmenuComponent, KitchenMenuListComponent, KitchenMenuAddComponent, KitchenMenuUpdateComponent } from './kitchenmenu/kitchenmenu.component';
import { KitchenitemComponent,KitchenMenuItemUpdateComponent } from './kitchenitem/kitchenitem.component';
import { FrontendComponent,CustomermailactivateComponent,FrontendLoginComponent,FrontendForgetPasswordComponent, FrontendRegisterComponent,FrontendProfileComponent, FrontendResetPasswordComponent, FrontendChangePasswordComponent, FrontendCustomerComponent, FrontendBrowseRestaurantsComponent, CustomerRestaurantDetailComponent, CustomerAccountInfoComponent, FrontendPageComponent, FrontendContactUsComponent, FrontendCheckoutComponent, FrontendThankYouComponent, CustomerDrivermailactivateComponent, FrontendDriverResetPasswordComponent } from './frontend/frontend.component';
import { OwnerCuisinesComponent } from './ownercuisines/ownercuisines.component'
import { WeeklyComponent, WeeklyDayAddComponent, WeeklyDayEditComponent, WeeklyDayListComponent} from './weekly/weekly.component';
import { MonthlyComponent, MonthlyDayAddComponent, MonthlyDayEditComponent, MonthlyDayListComponent } from './monthly/monthly.component';
import { ComboComponent,  ComboEditComponent, ComboListComponent } from './combo/combo.component';
import { OfferComponent, OfferAddComponent,  OfferEditComponent, OfferListComponent } from './offer/offer.component';
import { ReferralComponent,ReferralRegisterComponent, ReferralListComponent } from './referral/referral.component';
import {  CustomerReferralComponent, CustomerReferralRegisterComponent} from './customerreferral/referral.component';
import {NgPipesModule} from 'ngx-pipes';
import { SliderComponent , SliderListComponent } from './slider/slider.component';
import { IntroComponent , IntroListComponent } from './intro/slider.component';
import { CartComponent } from './cart/cart.component';
import { RatingComponent } from './rating/rating.component';
import { KitchenReportComponent, KitchenReportOrderComponent, KitchenReportDashboardComponent,KitchenReportOrderListComponent, KitchenReportCustomersComponent, OwnerEssentialsComponent, OwnerListViewComponent} from './kitchen-report/kitchen-report.component';
import { KitchenDriverComponent, KitchenDriverListComponent } from './kitchen-driver/kitchen-driver.component';
import { DriverupdateComponent, DriveraddComponent, AdmindriverComponent, DriverRestaurantComponent } from './admin-driver/index';
import { AdminCustomerComponent,CustomeraddComponent, CustomerupdateComponent } from './admin-customer/admin-customer.component';
import { Angular2SocialLoginModule } from "angular2-social-login";
import { AdminHeatmapComponent, AdminHeatmapDashboardComponent } from './admin-heatmap/admin-heatmap.component';
import { PaymentKeyConfigComponent } from './payment-key-config/payment-key-config.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database'


import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from "firebase";
import { AdminDeliveryChargesComponent } from './admin-delivery-charges/admin-delivery-charges.component';

var config = {
  apiKey: "AIzaSyD_12VUR8SMmflh7_LCffPhwP-VyCgqVqY",
  authDomain: "fir-cd1e8.firebaseapp.com",
  databaseURL: "https://fir-cd1e8.firebaseio.com",
  projectId: "fir-cd1e8",
  storageBucket: "fir-cd1e8.appspot.com",
  messagingSenderId: "760061774684"
};

firebase.initializeApp(config);

let providers = {    
    "facebook": {
      "clientId": "1827436067532339",
      "apiVersion": "v2.4" //like v2.4 
    }
  };
  
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,HeaderownerComponent,HeaderfrontendComponent,FooterfrontendComponent,HeaderOwnerReportComponent,
    HomeComponent,
    LoginComponent,ForgetComponent,ResetPasswordAdminComponent,
    AlertComponent,
    DashboardComponent, DashboardprofileComponent,DashboardsettingComponent,
    UsersComponent,UsersupdateComponent,UsersaddComponent,OwnerpartnerupdateComponent,
    OrderPipe,
    FilterPipe,
    SearchPipe,EllipsisPipe,
    SearchPipek,SliderListComponent,SearchPipeRestaurant,
    PageComponent,PagelistComponent,PageaddComponent,PageupdateComponent,
    OwnerComponent,OwnermailactivateComponent,KitchenDocumentComponent,OwnerpartnermailactivateComponent ,OwnerloginComponent, OwnerregisterComponent, OwnerprofileComponent, KitchenupdateComponent,KitchenupdatelocationComponent, OwnerchangepasswordComponent,ForgetOwnerComponent,ResetPasswordOwnerComponent,
    CityComponent,CitylistComponent, CityaddComponent, CityupdateComponent,KictchenPolicyComponent,
    CountryComponent,CountrylistComponent, CountryaddComponent, CountryupdateComponent,
    LanguageComponent,LanguagelistComponent, LanguageaddComponent, LanguageupdateComponent, 
    CuisinesComponent,CuisineslistComponent, CuisinesaddComponent, CuisinesupdateComponent ,
    KitchenComponent,KitchenlistComponent,KitchenaddComponent,KitchenupdateadminComponent, KitchensPolicySettingComponent, KitchenServicesSettingComponent,
    KitchenmenuComponent, KitchenMenuListComponent, KitchenMenuAddComponent, KitchenMenuUpdateComponent,
    KitchenitemComponent,KitchenMenuItemUpdateComponent,WeeklyDayEditComponent,WeeklyDayListComponent,
    FrontendComponent, FrontendLoginComponent, FrontendForgetPasswordComponent, FrontendRegisterComponent, FrontendProfileComponent, FrontendResetPasswordComponent, FrontendChangePasswordComponent,FrontendCustomerComponent,FrontendBrowseRestaurantsComponent,CustomerRestaurantDetailComponent,CustomerAccountInfoComponent,FrontendPageComponent,FrontendContactUsComponent,
    WeeklyComponent, WeeklyDayAddComponent,CustomermailactivateComponent,
    MonthlyComponent, MonthlyDayAddComponent, MonthlyDayEditComponent, MonthlyDayListComponent,
    ComboComponent, ComboEditComponent, ComboListComponent,OfferComponent, OfferAddComponent, OfferEditComponent, OfferListComponent, ReferralComponent, ReferralRegisterComponent,CustomerReferralComponent, CustomerReferralRegisterComponent,OwnerCuisinesComponent,FrontendCheckoutComponent, FrontendThankYouComponent, OwnerKitchenServicesComponent,
    PasswordComponent,PasswordComplexityComponent,PasswordChangeComponent,OwnerTaxComponent,OwnerActivateOfferingComponent, SliderComponent ,IntroComponent , IntroListComponent, CartComponent, RatingComponent, 
    KitchenReportComponent,KitchenReportOrderComponent,KitchenReportDashboardComponent,KitchenReportOrderListComponent, KitchenReportCustomersComponent, KitchenDriverComponent, KitchenDriverListComponent,ReferralListComponent,
    DriverupdateComponent, DriveraddComponent, AdmindriverComponent, DriverRestaurantComponent, AdminCustomerComponent,CustomeraddComponent, CustomerupdateComponent, AdminHeatmapComponent, AdminHeatmapDashboardComponent, KitchenServicesOrderListComponent, PaymentKeyConfigComponent, CustomerDrivermailactivateComponent, FrontendDriverResetPasswordComponent, OwnerRestaurantBasicComponent,OwnerMenuSetupComponent, OwnerBonusPointComponent, OwnerMyDriverComponent, OwnerEssentialsComponent, OwnerListViewComponent, AdminDeliveryChargesComponent],
  imports: [ 
    BrowserModule,   
    FormsModule,
    HttpModule,
    FileUploadModule,
    routing,
    ReactiveFormsModule,
    ReCaptchaModule,
    TinymceModule.withConfig({}),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAYQoBlDYqxMVhiiZFTzWljTUi84ZwoA6g",
      libraries: ["places"]
    }),SelectModule,
    NgPipesModule,    
    Angular2SocialLoginModule
  ],
 exports: [FileUploadModule],
  // tslint:disable-next-line:max-line-length
  providers: [AngularFireDatabase,LocalJsonService,RatingService, PaymentConfigService, DeliveryChargesService, AuthGuard, OwnerAuthGuard, AlertService, AuthService, UsersService, PageService, MasterService, KitchenService, KitchenMenuService,KitchenItemService, FrontendService, WeekMonthService,ComboService, OfferService, ReferralService, CustomerReferralService, FrontendRestaurantService, OrderService,SlidesService, IntroService, DriverService],
  bootstrap: [AppComponent]
  })

export class AppModule {}
Angular2SocialLoginModule.loadProvidersScripts(providers);
