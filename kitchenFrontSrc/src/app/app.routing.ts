import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent, DashboardprofileComponent, DashboardsettingComponent} from './dashboard/dashboard.component';

import { UsersComponent, UsersupdateComponent,OwnerpartnerupdateComponent, UsersaddComponent} from './users/index';
import { PageComponent,PagelistComponent,PageaddComponent,PageupdateComponent } from './page/page.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent,ForgetComponent,ResetPasswordAdminComponent } from './login/login.component';
import { AuthGuard,OwnerAuthGuard } from './guards/index';
import { PasswordComponent,PasswordComplexityComponent, PasswordChangeComponent} from './passwordcomplexity/password.component';
import { OwnerComponent,KictchenPolicyComponent,OwnermailactivateComponent, OwnerpartnermailactivateComponent,KitchenDocumentComponent, OwnerloginComponent, OwnerregisterComponent, OwnerprofileComponent, OwnerchangepasswordComponent, KitchenupdateComponent, KitchenupdatelocationComponent,ForgetOwnerComponent,ResetPasswordOwnerComponent,OwnerKitchenServicesComponent,OwnerTaxComponent, OwnerActivateOfferingComponent,OwnerRestaurantBasicComponent ,OwnerMenuSetupComponent, OwnerBonusPointComponent,OwnerMyDriverComponent} from './owner/owner.component'
import { CityComponent,CitylistComponent, CityaddComponent, CityupdateComponent } from './city/city.component';
import { CountryComponent,CountrylistComponent, CountryaddComponent, CountryupdateComponent } from './country/country.component';
import { LanguageComponent,LanguagelistComponent, LanguageaddComponent, LanguageupdateComponent } from './language/language.component'
import { CuisinesComponent,CuisineslistComponent, CuisinesaddComponent, CuisinesupdateComponent } from './cuisines/cuisines.component'
import { OwnerCuisinesComponent } from './ownercuisines/ownercuisines.component'
import { KitchenComponent,KitchenlistComponent,KitchenaddComponent,KitchenupdateadminComponent, KitchensPolicySettingComponent, KitchenServicesSettingComponent, KitchenServicesOrderListComponent } from './kitchen/kitchen.component'
import { KitchenmenuComponent, KitchenMenuListComponent, KitchenMenuAddComponent, KitchenMenuUpdateComponent } from './kitchenmenu/kitchenmenu.component';
import { KitchenitemComponent,KitchenMenuItemUpdateComponent } from './kitchenitem/kitchenitem.component'
import { WeeklyComponent, WeeklyDayAddComponent, WeeklyDayEditComponent, WeeklyDayListComponent} from './weekly/weekly.component'
import {  MonthlyComponent, MonthlyDayAddComponent, MonthlyDayEditComponent, MonthlyDayListComponent} from './monthly/monthly.component'
import {  ComboComponent, ComboEditComponent, ComboListComponent} from './combo/combo.component'
import {  OfferComponent,OfferAddComponent,OfferEditComponent, OfferListComponent} from './offer/offer.component'
import {  ReferralComponent, ReferralRegisterComponent,ReferralListComponent} from './referral/referral.component'
import {  CustomerReferralComponent, CustomerReferralRegisterComponent} from './customerreferral/referral.component'
import { FrontendComponent,FrontendLoginComponent,CustomermailactivateComponent, FrontendForgetPasswordComponent, FrontendRegisterComponent, FrontendProfileComponent, FrontendResetPasswordComponent, FrontendCustomerComponent, FrontendBrowseRestaurantsComponent, CustomerRestaurantDetailComponent, CustomerAccountInfoComponent, FrontendPageComponent, FrontendContactUsComponent, FrontendCheckoutComponent,FrontendThankYouComponent , CustomerDrivermailactivateComponent, FrontendDriverResetPasswordComponent} from './frontend/frontend.component';
import { SliderComponent, SliderListComponent } from './slider/slider.component';
import { IntroComponent, IntroListComponent } from './intro/slider.component';
import { KitchenReportComponent,KitchenReportOrderComponent, KitchenReportDashboardComponent, KitchenReportOrderListComponent, KitchenReportCustomersComponent , OwnerEssentialsComponent,OwnerListViewComponent} from './kitchen-report/kitchen-report.component';
import { KitchenDriverComponent, KitchenDriverListComponent } from './kitchen-driver/kitchen-driver.component';
import { DriverupdateComponent, DriveraddComponent, AdmindriverComponent,DriverRestaurantComponent } from './admin-driver/index';
import { AdminCustomerComponent, CustomeraddComponent, CustomerupdateComponent } from './admin-customer/admin-customer.component';
import { AdminHeatmapComponent , AdminHeatmapDashboardComponent} from './admin-heatmap/admin-heatmap.component';
import { PaymentKeyConfigComponent } from './payment-key-config/payment-key-config.component';
import { AdminDeliveryChargesComponent } from './admin-delivery-charges/admin-delivery-charges.component';
import { TestimonialComponent,TestimoniallistComponent,TestimonialaddComponent,TestimonialupdateComponent } from './admin-testimonial/Testimonial.component';

const appRoutes: Routes = [
     {path: '', component: FrontendComponent},
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
    { path: 'admin/login', component: LoginComponent },
    { path: 'admin', component: LoginComponent },
    { path: 'admin/forget-password', component: ForgetComponent },    
    { path: 'admin/resetpassword/:id', component: ResetPasswordAdminComponent },
    { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },
    { path: 'admin/profile', component: DashboardprofileComponent, canActivate: [AuthGuard]  },
    { path: 'admin/customer/list', component: AdminCustomerComponent, canActivate: [AuthGuard]  },
    { path: 'admin/customer/add', component: CustomeraddComponent, canActivate: [AuthGuard]  },
    { path: 'admin/customer/edit/:id', component: CustomerupdateComponent, canActivate: [AuthGuard]  },
    { path: 'admin/setting', component: DashboardsettingComponent, canActivate: [AuthGuard]  },
  	{ path: 'admin/users', component: UsersComponent, canActivate: [AuthGuard],children :[]  },
    { path: 'admin/users/:id', component: UsersupdateComponent, canActivate: [AuthGuard]  },
    { path: 'admin/user/add', component: UsersaddComponent, canActivate: [AuthGuard]  },
    { path: 'admin/partner/:id', component: OwnerpartnerupdateComponent, canActivate: [AuthGuard]  },
    { path: 'admin/driver/add', component: DriveraddComponent, canActivate: [AuthGuard]  },
    { path: 'admin/driver/list', component: AdmindriverComponent, canActivate: [AuthGuard]  },
    { path: 'admin/driver/edit/:id', component: DriverupdateComponent, canActivate: [AuthGuard]  },
    {path: 'admin/driver/restaurant/:id', component: DriverRestaurantComponent, canActivate: [AuthGuard]  },
    { path: 'admin/page', component: PageComponent, canActivate: [AuthGuard],children :[
    { path: 'list', component: PagelistComponent, canActivate: [AuthGuard]  },
    { path: 'add', component: PageaddComponent, canActivate: [AuthGuard]  },
    { path: 'edit/:id', component: PageupdateComponent, canActivate: [AuthGuard]  },
    ]},
    { path: 'admin/password', component: PasswordComponent, canActivate: [AuthGuard],children :[
        { path: 'complexity', component: PasswordComplexityComponent, canActivate: [AuthGuard]  },
        { path: 'change', component: PasswordChangeComponent, canActivate: [AuthGuard]  },        
    ]},

    { path: 'admin/heatmap', component: AdminHeatmapComponent, canActivate: [AuthGuard],children :[
        { path: 'dashboard', component: AdminHeatmapDashboardComponent, canActivate: [AuthGuard]  }
    ]},    
      { path: 'admin/country', component: CountryComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: CountrylistComponent, canActivate: [AuthGuard]  },
        { path: 'add', component: CountryaddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id', component: CountryupdateComponent, canActivate: [AuthGuard]  },
    ]},

     { path: 'admin/offer', component: OfferComponent, canActivate: [AuthGuard],children :[
        { path: 'list/:restaurantid', component: OfferListComponent, canActivate: [AuthGuard]  },
        { path: 'add/:restaurantid', component: OfferAddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id',  component: OfferEditComponent, canActivate: [AuthGuard]  },
    ]},
    { path: 'admin/testimonial', component: TestimonialComponent, canActivate: [AuthGuard], children :[
    { path: 'list', component: TestimoniallistComponent, canActivate: [AuthGuard]  },
    { path: 'add', component: TestimonialaddComponent, canActivate: [AuthGuard]  },
    { path: 'edit/:id', component: TestimonialupdateComponent, canActivate: [AuthGuard]  },
    ]},
      { path: 'admin/city', component: CityComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: CitylistComponent, canActivate: [AuthGuard]  },
        { path: 'add', component: CityaddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id', component: CityupdateComponent, canActivate: [AuthGuard]  },
    ]},
    { path: 'admin/cuisines', component: CuisinesComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: CuisineslistComponent, canActivate: [AuthGuard]  },
        { path: 'add', component: CuisinesaddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id', component: CuisinesupdateComponent, canActivate: [AuthGuard]  },
    ]},
    { path: 'admin/language', component: LanguageComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: LanguagelistComponent, canActivate: [AuthGuard]  },
        { path: 'add', component: LanguageaddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id', component: LanguageupdateComponent, canActivate: [AuthGuard]  },
    ]},
  	{ path: 'admin/kitchen', component: KitchenComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: KitchenlistComponent, canActivate: [AuthGuard]  },
        { path: 'add', component: KitchenaddComponent, canActivate: [AuthGuard]  },
        { path: 'edit/:id', component: KitchenupdateadminComponent, canActivate: [AuthGuard]  },
        { path: 'policyedit/:id', component: KitchensPolicySettingComponent, canActivate: [AuthGuard]  },
        { path: 'serviceedit/:id', component: KitchenServicesSettingComponent, canActivate: [AuthGuard]  },
        { path: 'orderlist/:id', component: KitchenServicesOrderListComponent, canActivate: [AuthGuard]  },
    ]},
    { path: 'admin/slides', component: SliderComponent, canActivate: [AuthGuard],children :[
        { path: 'list', component: SliderListComponent, canActivate: [AuthGuard]},
    ]},
    { path: 'admin/payment-key-config', component: PaymentKeyConfigComponent, canActivate: [AuthGuard]},
    { path: 'admin/delivery-charges', component: AdminDeliveryChargesComponent, canActivate: [AuthGuard]},
    
    { path: 'admin/intro', component: IntroComponent, canActivate: [AuthGuard],children :[
            { path: 'list', component: IntroListComponent, canActivate: [AuthGuard]},
    ]},    
    { path: 'owner', component: OwnerComponent,children :[
        { path: '', component: OwnerloginComponent },
        { path: 'login', component: OwnerloginComponent },
        { path: 'register', component: OwnerregisterComponent },
        { path: 'mailactivate/:activationid', component: OwnermailactivateComponent},
        { path: 'partner-mailactivate/:activationid', component: OwnerpartnermailactivateComponent},
        { path: 'forget-password', component: ForgetOwnerComponent },
        { path: 'resetpassword/:id', component: ResetPasswordOwnerComponent },
        { path: 'profile', component: OwnerprofileComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'kitchen-detail', component: KitchenupdateComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'kitchen-document', component: KitchenDocumentComponent, canActivate: [OwnerAuthGuard]  },        
        { path: 'kitchen-location', component: KitchenupdatelocationComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'change-password', component: OwnerchangepasswordComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'activate-offering', component: OwnerActivateOfferingComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'restaurant-basic', component: OwnerRestaurantBasicComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'menu-setup', component: OwnerMenuSetupComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'menu-setup', component: OwnerMenuSetupComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'bonus-point', component: OwnerBonusPointComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'my-driver', component: OwnerMyDriverComponent, canActivate: [OwnerAuthGuard]  },
        
        { path: 'weekly-add', component: WeeklyComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'weekly', component: WeeklyDayListComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'weekly-dayadd/:type/:id', component: WeeklyDayAddComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'weekly-dayedit/:type/:id', component: WeeklyDayEditComponent, canActivate: [OwnerAuthGuard]  },

        { path: 'monthly-add', component: MonthlyComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'monthly', component: MonthlyDayListComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'monthly-dayadd/:id', component: MonthlyDayAddComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'monthly-dayedit/:id', component: MonthlyDayEditComponent, canActivate: [OwnerAuthGuard]  },

        { path: 'combo-add', component: ComboComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'combo', component: ComboListComponent, canActivate: [OwnerAuthGuard]  },        
        { path: 'combo-edit/:id', component: ComboEditComponent, canActivate: [OwnerAuthGuard]  },

      /*  { path: 'offer-add', component: OfferComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'offer', component: OfferListComponent, canActivate: [OwnerAuthGuard]  },        
        { path: 'offer-edit/:id', component: OfferEditComponent, canActivate: [OwnerAuthGuard]  },
        */
        { path: 'cuisines', component: OwnerCuisinesComponent, canActivate: [OwnerAuthGuard]  }, 
        { path: 'kitchen-services', component: OwnerKitchenServicesComponent, canActivate: [OwnerAuthGuard]  }, 
        { path: 'kitchen-tax', component: OwnerTaxComponent, canActivate: [OwnerAuthGuard]  }, 
        { path: 'kitchen-policy', component: KictchenPolicyComponent, canActivate: [OwnerAuthGuard]  }, 

        { path: 'referral', component: ReferralComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'referralregister/:id', component: ReferralRegisterComponent },
        { path: 'referral-list', component: ReferralListComponent },


        { path: 'menu', component: KitchenmenuComponent, canActivate: [OwnerAuthGuard],children :[
            { path: 'list', component: KitchenMenuListComponent, canActivate: [OwnerAuthGuard]  },
            { path: 'add', component: KitchenMenuAddComponent, canActivate: [OwnerAuthGuard]  },
            { path: 'edit/:id', component: KitchenMenuUpdateComponent, canActivate: [OwnerAuthGuard]  },
            { path: 'item-add/:id', component: KitchenitemComponent, canActivate: [OwnerAuthGuard]  },
            { path: 'item-edit/:id', component: KitchenMenuItemUpdateComponent, canActivate: [OwnerAuthGuard]  }
            
        ]},

        { path: 'report', component: KitchenReportComponent, canActivate: [OwnerAuthGuard] , children: [
            { path: 'dashboard', component: KitchenReportDashboardComponent, canActivate: [OwnerAuthGuard]},
            { path: 'orderlist', component: KitchenReportOrderListComponent, canActivate: [OwnerAuthGuard]},
            { path: 'order/:id', component: KitchenReportOrderComponent, canActivate: [OwnerAuthGuard]},
            { path: 'customers', component: KitchenReportCustomersComponent, canActivate: [OwnerAuthGuard]},
        { path: 'essentials', component: OwnerEssentialsComponent, canActivate: [OwnerAuthGuard]  },
        { path: 'list-view', component: OwnerListViewComponent, canActivate: [OwnerAuthGuard]  },

        ]},


        { path: 'driver', component: KitchenDriverComponent, canActivate: [OwnerAuthGuard] , children: [
            { path: 'list', component: KitchenDriverListComponent, canActivate: [OwnerAuthGuard]  }

        ]}
    ]},    
    { path: 'customer', component: FrontendCustomerComponent, children :[
            { path: '', component: FrontendComponent },
            { path: 'login', component: FrontendLoginComponent },
            { path: 'register', component: FrontendRegisterComponent },
            { path: 'forget-password', component: FrontendForgetPasswordComponent },
            { path: 'profile', component: FrontendProfileComponent },
            { path: 'reset-password/:id', component: FrontendResetPasswordComponent },    
            { path: 'driver/reset-password/:id', component: FrontendDriverResetPasswordComponent },    
            { path: 'browse-restaurants', component: FrontendBrowseRestaurantsComponent },            
            { path: 'referral', component: CustomerReferralComponent },
            { path: 'referralregister/:id', component: CustomerReferralRegisterComponent },
            { path: 'restaurant-detail/:id', component: CustomerRestaurantDetailComponent },
            { path: 'accountinfo', component: CustomerAccountInfoComponent },
            { path: 'page/:page', component: FrontendPageComponent },
            { path: 'contactus', component: FrontendContactUsComponent },
            { path: 'checkout', component: FrontendCheckoutComponent },
            { path: 'thankyou', component: FrontendThankYouComponent },
            { path: 'mailactivate/:activationid', component: CustomermailactivateComponent},
            { path: 'drivermailactivate/:activationid', component: CustomerDrivermailactivateComponent},


    ]},
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);