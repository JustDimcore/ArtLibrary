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

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    MainContentComponent,
    RadioGroupComponent,
    ZeroIsAnyDirective
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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
