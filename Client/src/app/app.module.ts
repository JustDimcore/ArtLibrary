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
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadListComponent } from './upload-list/upload-list.component';
import { SizePipe } from './size.pipe';
import { ProgressPipe } from './progress.pipe';
import { RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import {HasTokenGuard} from './misc/has-token.guard';
import { RequestInterceptor } from './misc/request.interceptor';
import { SecurePipe } from './secure.pipe';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'google-auth', component: GoogleAuthComponent },
  { path: 'sprites', component: SpriteFinderComponent, canActivate: [HasTokenGuard] },
  { path: '',
    redirectTo: '/sprites',
    pathMatch: 'full'
  }
];

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
    ProgressPipe,
    LoginComponent,
    GoogleAuthComponent,
    SecurePipe
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
    FlexLayoutModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
