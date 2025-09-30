import { UmlClass, Association } from '../interfaces/diagramador.interface';

/**
 * Convierte un JSON de diagrama (tal como lo devuelve el backend)
 * en clases y asociaciones que el editor entiende.
 */
export function loadDiagram(umlJson: any): { classes: UmlClass[], associations: Association[] } {
  // Mapear clases
  const classes: UmlClass[] = (umlJson.classes || []).map((cls: any) => ({
    id: cls.id,
    name: cls.name,
    attributes: cls.attributes || [],
    x: cls.position?.x || 0,
    y: cls.position?.y || 0
  }));

  // Crear un índice rápido por id
  const classMap = new Map<string, UmlClass>();
  classes.forEach(c => classMap.set(c.id, c));

  // Resolver asociaciones
  const associations: Association[] = (umlJson.associations || []).map((assoc: any) => {
    const source = classMap.get(assoc.sourceClassId || "") || null;
    const target = classMap.get(assoc.targetClassId || "") || null;

    return {
      type: assoc.type,
      source,
      target,
      sourceMultiplicity: assoc.sourceMultiplicity || "1",
      targetMultiplicity: assoc.targetMultiplicity || "1",
      role: assoc.role || ""
    } as Association;
  });

  return { classes, associations };
}
