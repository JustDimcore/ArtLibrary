import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { SpritesListComponent } from './sprites-list/sprites-list.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { ZeroIsAnyDirective } from './directives/zeroIsAnyDirective';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SpriteFinderComponent } from './sprite-finder/sprite-finder.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadListComponent } from './upload-list/upload-list.component';
import { SizePipe } from './size.pipe';
import { ProgressPipe } from './progress.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    SpritesListComponent,
    RadioGroupComponent,
    ZeroIsAnyDirective,
    SpriteFinderComponent,
    HeaderComponent,
    UploadListComponent,
    SizePipe,
    ProgressPipe
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
    HttpClientModule,
    FlexLayoutModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
}
