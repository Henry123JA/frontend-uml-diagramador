import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Diagram {
  private baseUrl = 'http://localhost:8080/api/codegen';

  constructor(private http: HttpClient) {}
/*
  saveDiagram(diagramData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/diagrams`, diagramData);
  }
*/
  generateSQL(umlJson: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate-sql`, umlJson, { responseType: 'blob' as 'json' }) as any;
  }
/*
  generateBackend(umlJson: any): Observable<Blob> {
    return this.http.post(`${this.base}/generate-backend`, umlJson, { responseType: 'blob' as 'json' }) as any;
  }*/

  generateBackend(diagram: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate-backend`, diagram, {
      responseType: 'blob'
    });
  }

  generateInserts(umlJson: any, rows: number): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate-sql-inserts?rows=${rows}`, umlJson, { responseType: 'blob' as 'json' }) as any;
  }

  // opcional: generar XML para draw.io
  generateXml(umlJson: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/generate-xml`, umlJson, { responseType: 'blob' as 'json' }) as any;
  }

}
