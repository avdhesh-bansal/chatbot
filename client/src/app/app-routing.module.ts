import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

import { AppComponent } from './app.component';
import { ThemeComponent } from './pages/theme/theme.component';
import { HomeComponent } from './pages/home/home.component';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '',      component: HomeComponent, pathMatch: 'full' },
      { path: 'theme', component: ThemeComponent },
      { path: 'secure/configurations', component: ConfigurationsComponent, canActivate: [AuthGuard] },
      { path: '**', component: HomeComponent }
    ])
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor(private router: Router) {
  	this.router.errorHandler = (error: any) => {
  		this.router.navigate(['404']); // or redirect to default route
  	}
  }
}
