import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UmlEditor } from './uml-editor/uml-editor';
import { ProjectList } from './project-list/project-list';

const routes: Routes = [
  { path: 'uml', component: UmlEditor },
  { path: 'projects', component: ProjectList },
  { path: 'uml-editor', component: UmlEditor },      
  { path: 'uml-editor/:id', component: UmlEditor }
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