import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { ZeroIsAnyDirective } from './directives/zeroIsAnyDirective';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SpriteFinderComponent } from './sprite-finder/sprite-finder.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainContentComponent,
    RadioGroupComponent,
    ZeroIsAnyDirective,
    SpriteFinderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
