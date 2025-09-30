// src/app/utils/export.utils.ts

// Función para descargar un archivo
export function downloadFile(filename: string, content: Blob | string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Función para exportar JSON del modelo UML
export function exportToJson(classes: any[], associations: any[]) {
  const completeModel = {
    classes: classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      attributes: cls.attributes.map((attr: any) => ({
        name: attr.name,
        type: attr.type
      })),
      position: { x: cls.x, y: cls.y }
    })),
    associations: associations.map((assoc: any) => ({
      id: crypto.randomUUID(),
      type: assoc.type,
      sourceClassId: assoc.source.id,
      targetClassId: assoc.target.id,
      sourceClassName: assoc.source.name,
      targetClassName: assoc.target.name,
      sourceMultiplicity: assoc.sourceMultiplicity || "1",
      targetMultiplicity: assoc.targetMultiplicity || "1",
      role: assoc.role || ""
    })),
    metadata: {
      version: "1.0",
      createdAt: new Date().toISOString(),
      totalClasses: classes.length,
      totalAssociations: associations.length
    }
  };

  return completeModel;
}

// Función para exportar JSON del modelo UML (simplificado)
export function exportToJsonMinimal(classes: any[], associations: any[]) {
  const minimalModel = {
    classes: classes.map(cls => ({
      name: cls.name,
      attributes: cls.attributes.map((attr: any) => ({
        name: attr.name,
        type: attr.type
      }))
    })),
    associations: associations.map((assoc: any) => ({
      type: assoc.type, // association | aggregation | composition | inheritance
      sourceClassName: assoc.source.name,
      targetClassName: assoc.target.name,
      sourceMultiplicity: assoc.sourceMultiplicity || "1",
      targetMultiplicity: assoc.targetMultiplicity || "1",
      role: assoc.role || ""
    }))
  };

  return minimalModel;
}

