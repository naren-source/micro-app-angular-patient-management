import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PatientMgmtPageComponent } from './patient-mgmt-page/patient-mgmt-page.component';

const appRoutes: Routes = [
  {
    path: 'patientmgmt',
    component: PatientMgmtPageComponent
  },
  {
    path: '',
    redirectTo: 'patientmgmt',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo:'patientmgmt',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    PatientMgmtPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,    
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
