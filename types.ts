export interface ArchitectResponse {
  viabilityScore: number;
  viabilityAnalysis: string;
  strategy2026: string;
  dataModel: string; // TypeScript Interface code
  backendImpl: string; // Firebase/Node code
  securityContext: string;
}

export interface VaultItem {
  id: string;
  title: string;
  createdAt: number;
  data: ArchitectResponse;
}

export enum AppState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface FileInput {
  file: File | null;
  previewUrl: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'ARCHITECT' | 'ENGINEER';
}