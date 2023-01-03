import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
// import { CKEditorModule } from 'ckeditor4-angular';
@NgModule({
  declarations: [
       SidebarComponent,
       FooterComponent,
       NavbarComponent,
       UnauthorizedComponent,
       NotFoundComponent
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    // CKEditorModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    // CKEditorModule
  ]
})
export class SharedModule { }
