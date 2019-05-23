import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SpritesListComponent } from './components/sprites-list/sprites-list.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { ZeroIsAnyDirective } from './directives/zeroIsAnyDirective';
import { SpriteFinderComponent } from './components/sprite-finder/sprite-finder.component';
import { HeaderComponent } from './components/header/header.component';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { SizePipe } from './pipes/size.pipe';
import { ProgressPipe } from './pipes/progress.pipe';
import { LoginComponent } from './components/login/login.component';
import { GoogleAuthComponent } from './components/google-auth/google-auth.component';
import { HasTokenGuard} from './misc/has-token.guard';
import { RequestInterceptor } from './misc/request.interceptor';
import { SecurePipe } from './pipes/secure.pipe';

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
