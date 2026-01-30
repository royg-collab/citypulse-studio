
export enum FileType {
  CSV = 'CSV',
  IMAGE = 'IMAGE',
  PDF = 'PDF'
}

export interface CityFile {
  id: string;
  name: string;
  type: FileType;
  content: string; // Base64 for images, text for others
  mimeType: string;
}

export interface AnalysisResult {
  keyInsights: string[]; // Should be exactly 3
  risks: string[]; // Should be exactly 2
  primaryRecommendation: string; // The single most important recommendation
  problems: {
    title: string;
    description: string;
    affectedZones: string[];
    severity: 'High' | 'Medium' | 'Low';
  }[];
  rootCauses: {
    description: string;
    dataEvidence: string;
    researchBasis: string;
  }[];
  strategies: {
    title: string;
    details: string;
    source: string;
  }[];
  prototype: {
    logic: string;
    pseudocode: string;
    implementationNotes: string;
  };
}

export interface TranscriptionState {
  isRecording: boolean;
  text: string;
  status: 'idle' | 'recording' | 'transcribing' | 'done';
}
