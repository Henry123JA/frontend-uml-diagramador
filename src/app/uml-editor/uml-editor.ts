import { Component } from '@angular/core';
import { UmlClass, UmlAttribute, Association } from '../interfaces/diagramador.interface';

@Component({
  selector: 'app-uml-editor',
  standalone: false,
  templateUrl: './uml-editor.html',
  styleUrl: './uml-editor.css'
})

export class UmlEditor {

  classes: UmlClass[] = [];
  associations: Association[] = [];
  selectedAssociation: Association | null = null;
  selectedClass: UmlClass | null = null;
  selectedClasses: UmlClass[] = [];
  private dragTarget: UmlClass | null = null;
  private offsetX = 0;
  private offsetY = 0;
//-------------------------CLASES----------------------------------------
  addClass() {
    this.classes.push({
      id: crypto.randomUUID(),
      name: 'NuevaClase',
      attributes: [],
      x: 50 + this.classes.length * 20,
      y: 50 + this.classes.length * 20
    });
  }

  toggleSelect(cls: UmlClass) {
    const index = this.selectedClasses.indexOf(cls);
    if (index >= 0) {
      this.selectedClasses.splice(index, 1); // deseleccionar
    } else {
      if (this.selectedClasses.length < 2) {
        this.selectedClasses.push(cls);
      }
    }
  }
//-------------------------ASOCIACION----------------------------------------
  addAssociation() {
    if (this.selectedClasses.length === 2) {
      const [c1, c2] = this.selectedClasses;
      this.associations.push({ 
        source: c1, 
        target: c2, 
        sourceMultiplicity: "1", 
        targetMultiplicity: "1", 
        role: "relacion" ,
        type: 'association'
      });
      this.selectedClasses = []; // limpiar selección
    }
  }
  editAssociation(assoc: Association) {
    this.selectedAssociation = assoc;
  }

  closeAssocModal() {
    this.selectedAssociation = null;
  }
  //-------------------------RELACIÓN MUCHOS A MUCHOS----------------------------------------
  addManyToMany() {
    if (this.selectedClasses.length === 2) {
      const [class1, class2] = this.selectedClasses;
      
      // Crear la clase intermedia
      const intermediateName = `${class1.name}${class2.name}`;
      const intermediateClass: UmlClass = {
        id: crypto.randomUUID(),
        name: intermediateName,
        attributes: [
          { name: `${class1.name.toLowerCase()}Id`, type: 'int' },
          { name: `${class2.name.toLowerCase()}Id`, type: 'int' }
        ],
        x: (class1.x + class2.x) / 2,
        y: (class1.y + class2.y) / 2 + 100 // Un poco abajo del centro
      };
      
      // Agregar la clase intermedia
      this.classes.push(intermediateClass);
      
      // Crear las dos relaciones uno a muchos
      this.associations.push({
        source: class1,
        target: intermediateClass,
        type: 'association',
        role: 'tiene',
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      });
      
      this.associations.push({
        source: class2,
        target: intermediateClass,
        type: 'association',
        role: 'tiene',
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      });
      
      this.selectedClasses = []; // limpiar selección
    }
  }
  //-------------------------HERENCIA----------------------------------------
  addInheritance() {
    if (this.selectedClasses.length === 2) {
      const [child, parent] = this.selectedClasses;
      this.associations.push({
        source: child,
        target: parent,
        type: 'inheritance',
        role: 'extends'
      });
      this.selectedClasses = [];
    }
  }


  startDrag(event: MouseEvent, cls: UmlClass) {
    this.dragTarget = cls;
    this.offsetX = event.offsetX - cls.x;
    this.offsetY = event.offsetY - cls.y;
    event.stopPropagation();
  }

  onMouseDown(event: MouseEvent) {}
  onMouseMove(event: MouseEvent) {
    if (this.dragTarget) {
      this.dragTarget.x = event.offsetX - this.offsetX;
      this.dragTarget.y = event.offsetY - this.offsetY;
    }
  }
  onMouseUp(event: MouseEvent) {
    this.dragTarget = null;
  }

  editClass(cls: UmlClass) {
    this.selectedClass = cls;
  }
//-------------------------ATRIBUTOS----------------------------------------
  addAttribute() {
    if (this.selectedClass) {
      this.selectedClass.attributes.push({ name: 'nuevo', type: 'String' });
    }
  }

  closeModal() {
    this.selectedClass = null;
  }

  // -------------------------AGREGACIÓN----------------------------------------
  addAggregation() {
    if (this.selectedClasses.length === 2) {
      const [whole, part] = this.selectedClasses;
      this.associations.push({
        source: whole,
        target: part,
        type: 'aggregation',
        role: 'agregacion',
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      });
      this.selectedClasses = [];
    }
  }

  // -------------------------COMPOSICIÓN----------------------------------------
  addComposition() {
    if (this.selectedClasses.length === 2) {
      const [whole, part] = this.selectedClasses;
      this.associations.push({
        source: whole,
        target: part,
        type: 'composition',
        role: 'composicion',
        sourceMultiplicity: "1",
        targetMultiplicity: "0..*"
      });
      this.selectedClasses = [];
    }
  }


  getClassWidth(cls: UmlClass): number {
    const nameLength = cls.name.length * 8; // 8px aprox por letra
    const maxAttrLength = Math.max(
      0,
      ...cls.attributes.map(attr => (attr.name + ':' + attr.type).length * 7)
    );
    return Math.max(160, nameLength, maxAttrLength);
  }

  getClassHeight(cls: UmlClass): number {
    return 40 + cls.attributes.length * 20+10;
  }

  getAngle(source: UmlClass, target: UmlClass): number {
    const sx = source.x + this.getClassWidth(source) / 2;
    const sy = source.y + this.getClassHeight(source) / 2;
    const tx = target.x + this.getClassWidth(target) / 2;
    const ty = target.y + this.getClassHeight(target) / 2;

    const dx = tx - sx;
    const dy = ty - sy;
    return Math.atan2(dy, dx) * (180 / Math.PI); // en grados
  }
  // Punto en el borde de la clase (rectángulo)
  getBorderPoint(cls: UmlClass, other: UmlClass, extra = 20) {
    const dx = other.x - cls.x;
    const dy = other.y - cls.y;
    const angle = Math.atan2(dy, dx);

    const halfW = this.getClassWidth(cls) / 2;
    const halfH = this.getClassHeight(cls) / 2;

    // punto en el borde del rectángulo
    const px = cls.x + halfW + Math.cos(angle) * halfW;
    const py = cls.y + halfH + Math.sin(angle) * halfH;

    // alejar el texto un poco más hacia afuera (extra)
    return {
      x: px + Math.cos(angle) * extra,
      y: py + Math.sin(angle) * extra,
    };
  }

  getInheritanceArrow(source: UmlClass, target: UmlClass): string {
    const sx = source.x + this.getClassWidth(source) / 2;
    const sy = source.y + this.getClassHeight(source) / 2;
    const tx = target.x + this.getClassWidth(target) / 2;
    const ty = target.y + this.getClassHeight(target) / 2;

    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return "";

    const ux = dx / len;
    const uy = dy / len;

    // 👉 Punto exacto en el borde del rectángulo padre
    const halfW = this.getClassWidth(target) / 2;
    const halfH = this.getClassHeight(target) / 2;

    // calculamos cuánto recorrer hasta salir del rectángulo
    const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
    const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);

    const tipX = tx - dx * scale;
    const tipY = ty - dy * scale;

    // 👉 Base del triángulo (unos 20px antes)
    const baseX = tipX - ux * 20;
    const baseY = tipY - uy * 20;

    // 👉 Perpendicular para abrir el triángulo
    const perpX = -uy;
    const perpY = ux;

    const size = 12; // ancho del triángulo
    const p1x = baseX + perpX * size;
    const p1y = baseY + perpY * size;
    const p2x = baseX - perpX * size;
    const p2y = baseY - perpY * size;

    return `${tipX},${tipY} ${p1x},${p1y} ${p2x},${p2y}`;
  }
  // ========================= MÉTODO TYPESCRIPT =========================
  // Reemplaza tu método getDiamondArrow actual con este:

  getDiamondArrow(source: UmlClass, target: UmlClass): string {
    const sx = source.x + this.getClassWidth(source) / 2;
    const sy = source.y + this.getClassHeight(source) / 2;
    const tx = target.x + this.getClassWidth(target) / 2;
    const ty = target.y + this.getClassHeight(target) / 2;

    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return "";

    const ux = dx / len;
    const uy = dy / len;

    // 👉 Punto exacto en el borde del rectángulo destino
    const halfW = this.getClassWidth(target) / 2;
    const halfH = this.getClassHeight(target) / 2;

    // Calculamos cuánto recorrer hasta salir del rectángulo
    const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
    const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);

    const tipX = tx - dx * scale;
    const tipY = ty - dy * scale;

    // 👉 Puntos del rombo (diamante)
    const diamondLength = 30; // longitud del rombo
    const diamondWidth = 12;   // ancho del rombo

    // Centro del rombo (un poco antes del borde)
    const centerX = tipX - ux * (diamondLength / 2);
    const centerY = tipY - uy * (diamondLength / 2);

    // 👉 Vector perpendicular para los lados del rombo
    const perpX = -uy;
    const perpY = ux;

    // 👉 Los 4 puntos del rombo
    const frontX = tipX; // punta que toca el borde
    const frontY = tipY;
    
    const backX = tipX - ux * diamondLength; // punta trasera
    const backY = tipY - uy * diamondLength;
    
    const topX = centerX + perpX * diamondWidth; // lado superior
    const topY = centerY + perpY * diamondWidth;
    
    const bottomX = centerX - perpX * diamondWidth; // lado inferior
    const bottomY = centerY - perpY * diamondWidth;

    // Retornamos los puntos del rombo en orden para formar la figura
    return `${frontX},${frontY} ${topX},${topY} ${backX},${backY} ${bottomX},${bottomY}`;
  }

  // Método auxiliar para obtener el punto de conexión de la línea al rombo
  getDiamondConnectionPoint(source: UmlClass, target: UmlClass): {x: number, y: number} {
    const sx = source.x + this.getClassWidth(source) / 2;
    const sy = source.y + this.getClassHeight(source) / 2;
    const tx = target.x + this.getClassWidth(target) / 2;
    const ty = target.y + this.getClassHeight(target) / 2;

    const dx = tx - sx;
    const dy = ty - sy;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len === 0) return { x: tx, y: ty };

    const ux = dx / len;
    const uy = dy / len;

    // 👉 Punto exacto en el borde del rectángulo destino
    const halfW = this.getClassWidth(target) / 2;
    const halfH = this.getClassHeight(target) / 2;

    const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
    const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);

    const tipX = tx - dx * scale;
    const tipY = ty - dy * scale;

    // Retorna el punto trasero del rombo donde debe conectar la línea
    const backX = tipX - ux * 16; // 16 es la longitud del rombo
    const backY = tipY - uy * 16;

    return { x: backX, y: backY };
  }
  // ========================= EXPORTAR =========================
  private umlModel = [
    {
      name: 'User',
      attributes: [
      //  { name: 'id', type: 'integer'},
        { name: 'name', type: 'String'},
        { name: 'email', type: 'String'}
      ]
    },
    {
      name: 'producto',
      attributes: [
       // { name: 'id', type: 'integer'},
        { name: 'name', type: 'String'},
        { name: 'price', type: 'double'}
      ]
    }
  ]


  //-------------------------EXPORT JSON COMPLETO----------------------------------------
  export(type: 'json' | 'sql' | 'backend') {
    if (type === 'json') {
      const completeModel = {
        classes: this.classes.map(cls => ({
          id: cls.id,
          name: cls.name,
          attributes: cls.attributes.map(attr => ({
            name: attr.name,
            type: attr.type
          })),
          // Opcional: incluir posición para recrear el diagrama visualmente
          position: {
            x: cls.x,
            y: cls.y
          }
        })),
        
        associations: this.associations.map(assoc => ({
          id: crypto.randomUUID(), // generar ID si no existe
          type: assoc.type,
          sourceClassId: assoc.source.id,
          targetClassId: assoc.target.id,
          sourceClassName: assoc.source.name, // para legibilidad
          targetClassName: assoc.target.name, // para legibilidad
          sourceMultiplicity: assoc.sourceMultiplicity || "1",
          targetMultiplicity: assoc.targetMultiplicity || "1",
          role: assoc.role || ""
        })),
        
        // Metadata adicional
        metadata: {
          version: "1.0",
          createdAt: new Date().toISOString(),
          totalClasses: this.classes.length,
          totalAssociations: this.associations.length
        }
      };
      
      this.download('diagram.json', JSON.stringify(completeModel, null, 2));
      console.log('👉 JSON exportado:', completeModel);
    }
    
    if (type === 'sql') {
      // Solo clases para SQL (como antes)
      const sqlModel = this.classes.map(cls => ({
        name: cls.name,
        attributes: cls.attributes
      }));
      
      fetch('http://localhost:8080/api/generator/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sqlModel),
      })
        .then(res => res.blob())
        .then(blob => this.download('schema.sql', blob));
      console.log('👉 Generar SQL...');
    }
    
    if (type === 'backend') {
      // Solo clases para backend (como antes)
      const backendModel = this.classes.map(cls => ({
        name: cls.name,
        attributes: cls.attributes
      }));
      
      fetch('http://localhost:8080/api/generator/backend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendModel),
      })
        .then(res => res.blob())
        .then(blob => this.download('backend.zip', blob));
      console.log('👉 Generar Backend...');
    }
  }

  //-------------------------GUARDAR DIAGRAMA EN BACKEND----------------------------------------
  saveDiagram() {
    const diagramData = {
      name: prompt("Nombre del diagrama:") || "Mi Diagrama",
      classes: this.classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        attributes: cls.attributes,
        position: { x: cls.x, y: cls.y }
      })),
      associations: this.associations.map(assoc => ({
        type: assoc.type,
        sourceClassId: assoc.source.id,
        targetClassId: assoc.target.id,
        sourceMultiplicity: assoc.sourceMultiplicity || "1",
        targetMultiplicity: assoc.targetMultiplicity || "1",
        role: assoc.role || ""
      }))
    };
    
    fetch('http://localhost:8080/api/diagrams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(diagramData)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Diagrama guardado:', data);
      alert('Diagrama guardado exitosamente');
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error al guardar el diagrama');
    });
  }

  private download(filename: string, content: Blob | string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  //----------------------------para eliminar clases y asociaciones y atributos-------------------------------

  //-------------------------ELIMINAR----------------------------------------
  deleteClass(cls: UmlClass) {
    // Eliminar asociaciones que usan esta clase
    this.associations = this.associations.filter(assoc => 
      assoc.source.id !== cls.id && assoc.target.id !== cls.id
    );
    // Eliminar la clase
    this.classes = this.classes.filter(c => c.id !== cls.id);
    // Limpiar selecciones
    this.selectedClasses = this.selectedClasses.filter(c => c.id !== cls.id);
    if (this.selectedClass?.id === cls.id) this.selectedClass = null;
  }
  deleteSelectedClasses() {
    this.selectedClasses.forEach(cls => this.deleteClass(cls));
    this.selectedClasses = [];
  }

  deleteAssociation(assoc: Association) {
    this.associations = this.associations.filter(a => a !== assoc);
    if (this.selectedAssociation === assoc) this.selectedAssociation = null;
  }

  deleteAttribute(attr: UmlAttribute) {
    if (this.selectedClass) {
      const index = this.selectedClass.attributes.indexOf(attr);
      this.selectedClass.attributes.splice(index, 1);
    }
  }

}

