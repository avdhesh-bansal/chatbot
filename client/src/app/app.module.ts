import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserXhr, HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { MomentTimezoneModule } from 'angular-moment-timezone';

import { AppRoutingModule } from './app-routing.module';
import {environment} from '../environments/environment';
import { AppComponent } from './app.component';
import { ThemeComponent } from './pages/theme/theme.component';
import { HomeComponent } from './pages/home/home.component';
import { CookieService } from 'ngx-cookie-service';
import { MyAuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { ConversationService } from './services/conversation.service';
import { NgProgressModule } from '@ngx-progressbar/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { MinutesConversionPipe } from './pipes/humanize-mins.pipe';
import {PrettyJsonModule} from 'angular2-prettyjson';
import { ConfigurationsComponent } from './pages/configurations/configurations.component';


const config: SocketIoConfig = { url: environment.socket.baseUrl, options: environment.socket.options };

@NgModule({
  declarations: [
    AppComponent,
    ThemeComponent,
    HomeComponent,
    MinutesConversionPipe,
    ConfigurationsComponent
  ],
  imports: [
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    BrowserModule,
    HttpModule,
    NgProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    MomentTimezoneModule,
    PrettyJsonModule
  ],
  providers: [SharedService, ConversationService, CookieService, MyAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
