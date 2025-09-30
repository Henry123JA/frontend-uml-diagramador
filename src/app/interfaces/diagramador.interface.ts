export interface UmlAttribute {
  name: string;
  type: string;
}

export interface UmlClass {
  id: string;
  name: string;
  attributes: UmlAttribute[];
  x: number;
  y: number;
}

export interface Association {
  source: UmlClass;
  target: UmlClass;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
  role?: string;
  type: 'association' | 'inheritance'| 'aggregation' | 'composition';
}



export interface ProjectDto {
  id?: number;
  projectName: string;
  basePackage?: string;
  createdBy?: string;
  umlJson: any;
}