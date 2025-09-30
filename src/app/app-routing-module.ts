import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UmlEditor } from './uml-editor/uml-editor';

const routes: Routes = [
  { path: 'uml', component: UmlEditor },
  { path: '', redirectTo: 'uml', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }