import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectDto } from '../interfaces/diagramador.interface';


@Injectable({
  providedIn: 'root'
})
export class Project {
  
  private base = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  list(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.base);
  }

  get(id: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.base}/${id}`);
  }

  create(project: ProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.base, project);
  }

  update(id: number, project: ProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.base}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
