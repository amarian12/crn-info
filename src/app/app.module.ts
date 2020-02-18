import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import {TabMenuModule} from 'primeng/tabmenu';
import { CarouselModule } from 'primeng/carousel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';

import { PipesPipe } from './pipes/pipes.pipe';
import { HomeComponent } from './home/home/home.component';
import { RelaynodesComponent } from './relaynodes/relaynodes/relaynodes.component';
import { ApiserviceService } from './providers/apiservice.service';

@NgModule({
   declarations: [
      AppComponent,
      PipesPipe,
      HomeComponent,
      RelaynodesComponent,
   ],
   imports: [
      AngularFontAwesomeModule,
      NgbModule,
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      AppRoutingModule,
      InputTextModule,
      ButtonModule,
      TableModule,
      DialogModule,
      CheckboxModule,
      TabMenuModule,
      CarouselModule,
      HttpClientModule,
      ProgressSpinnerModule,
      DropdownModule
   ],
   providers: [
      ApiserviceService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
