import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../services/project';
import { ProjectDto } from '../interfaces/diagramador.interface';
import { Diagram } from '../services/diagram';

@Component({
  selector: 'app-project-list',
  standalone: false,
  templateUrl: './project-list.html',
  styleUrl: './project-list.css'
})
export class ProjectList{
  projects: ProjectDto[] = [];
  loading = false;

  constructor(
    private projectsSvc: Project,
    private diagramSvc: Diagram,
    private router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading = true;
    this.projectsSvc.list().subscribe({
      next: (data) => { this.projects = data; this.loading = false; },
      error: () => { this.loading = false; alert('Error cargando proyectos'); }
    });
  }

  createNew() { this.router.navigate(['/uml-editor']); }

  edit(p: ProjectDto) { this.router.navigate(['/uml-editor', p.id]); }

  delete(p: ProjectDto) {
    if (!confirm(`Eliminar proyecto "${p.projectName}"?`)) return;
    this.projectsSvc.delete(p.id!).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar')
    });
  }


}
