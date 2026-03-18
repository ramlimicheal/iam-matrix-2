export enum ColumnType {
  DECLARATION = 'Declaration',
  EVIDENCE = 'Evidence',
  ACTION = 'Action',
  GRATITUDE = 'Gratitude'
}

export interface MatrixEntry {
  id: string;
  domainId: string;
  declaration: string; // I Am...
  evidence: string;    // I have... (Past proof)
  action: string;      // I will... (Next step)
  gratitude: string;   // I am grateful for...
}

export interface LifeDomain {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface WeaverResponse {
  suggestion: string;
  reasoning: string;
}

export interface WeaverMessage {
  role: 'user' | 'model';
  text: string;
}
