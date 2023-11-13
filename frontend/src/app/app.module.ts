import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {SignUpPageComponent} from './presentation/pages/sign-up-page/sign-up-page.component';
import {SignInPageComponent} from './presentation/pages/sign-in-page/sign-in-page.component';
import {ChangePasswordPageComponent} from './presentation/pages/change-password-page/change-password-page.component';
import {MainPageComponent} from './presentation/pages/main-page/main-page.component';
import {ArchivePageComponent} from './presentation/pages/archive-page/archive-page.component';
import {AddPageComponent} from './presentation/pages/add-page/add-page.component';
import {RouterModule, Routes} from "@angular/router";
import {UnknownPageComponent} from './presentation/pages/unknown-page/unknown-page.component';
import {NgOptimizedImage} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TopLogoLayoutComponent} from './presentation/shared/layouts/top-logo-layout/top-logo-layout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {RecordsListComponent} from './presentation/shared/components/records-list/records-list.component';
import {
  ImageWithFiguresComponent
} from './presentation/shared/components/image-with-figures/image-with-figures.component';
import {AuthenticationInterceptor} from "./presentation/shared/interceptors/authentication.interceptor";
import {MdbModalModule} from 'mdb-angular-ui-kit/modal';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DeleteAccountModalComponent
} from './presentation/shared/components/delete-account-modal/delete-account-modal.component';
import { UploadImagesComponent } from './presentation/shared/components/upload-images/upload-images.component';
import { ChangeImageSelectionComponent } from './presentation/shared/components/change-image-selection/change-image-selection.component';
import { ShowComparisonResultComponent } from './presentation/shared/components/show-comparison-result/show-comparison-result.component';
import { ImageSelectionComponent } from './presentation/shared/components/image-selection/image-selection.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import { ImageSelectionCornerComponent } from './presentation/shared/components/image-selection-corner/image-selection-corner.component';
import { ImageWithFiguresModalComponent } from './presentation/shared/components/image-with-figures-modal/image-with-figures-modal.component';
import { AdminPageComponent } from './presentation/pages/admin-page/admin-page.component';
import { UsersListComponent } from './presentation/shared/components/users-list/users-list.component';
import { UserRecordsModalComponent } from './presentation/shared/components/user-records-modal/user-records-modal.component';
import { DeleteUserModalComponent } from './presentation/shared/components/delete-user-modal/delete-user-modal.component';

export const mainPageUrl: string = 'main';
export const signInPageUrl: string = 'sign-in';
export const signUpPageUrl: string = 'sign-up';
export const changePasswordPageUrl: string = 'change-password';
export const archivePageUrl: string = 'archive';
export const addPageUrl: string = 'add';
export const adminPageUrl: string = 'admin';

const routes: Routes = [
  {
    path: '', component: TopLogoLayoutComponent, children: [
      {path: signInPageUrl, title: 'Вход', component: SignInPageComponent},
      {path: signUpPageUrl, title: 'Регистрация', component: SignUpPageComponent},
      {path: changePasswordPageUrl, title: 'Смена пароля', component: ChangePasswordPageComponent},
      {path: mainPageUrl, title: 'Главная', component: MainPageComponent},
      {path: '', redirectTo: `/${signInPageUrl}`, pathMatch: 'full'}
    ]
  },
  {path: archivePageUrl, title: 'Архив', component: ArchivePageComponent},
  {path: addPageUrl, title: 'Добавить', component: AddPageComponent},
  {path: adminPageUrl, title: 'Пользователи', component: AdminPageComponent},
  {path: '**', title: 'Страница не найдена', component: UnknownPageComponent}
];

const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
];

@NgModule({
  declarations: [
    AppComponent,
    SignUpPageComponent,
    SignInPageComponent,
    ChangePasswordPageComponent,
    MainPageComponent,
    ArchivePageComponent,
    AddPageComponent,
    UnknownPageComponent,
    TopLogoLayoutComponent,
    RecordsListComponent,
    ImageWithFiguresComponent,
    DeleteAccountModalComponent,
    UploadImagesComponent,
    ChangeImageSelectionComponent,
    ShowComparisonResultComponent,
    ImageSelectionComponent,
    ImageSelectionCornerComponent,
    ImageWithFiguresModalComponent,
    AdminPageComponent,
    UsersListComponent,
    UserRecordsModalComponent,
    DeleteUserModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MdbModalModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
