

export type ViewType = 'front' | 'back' | 'side' | 'extension' | 'flexion';

export interface Point2D {
  x: number;
  y: number;
}

export interface PostureLandmarks {
  head: Point2D;
  ear: Point2D;
  shoulder: Point2D;
  spinePath: Point2D[];
  hip: Point2D;
  knee: Point2D;
  ankle: Point2D;
  heel: Point2D;
}

export interface PosturePoint {
  label: string;
  beforeScore: number; 
  afterScore: number;  
  description: string;
  status: 'improved' | 'same' | 'needs-attention';
}

export interface AnalysisResults {
  viewA: {
    type: ViewType;
    beforeLandmarks: PostureLandmarks;
    afterLandmarks: PostureLandmarks;
  };
  overallBeforeScore: number;
  overallAfterScore: number;
  detailedScores: {
    straightNeck: PosturePoint;
    rolledShoulder: PosturePoint;
    kyphosis: PosturePoint;
    swayback: PosturePoint;
    oLegs: PosturePoint;
  };
  summary: string;
}

export interface PhotoData {
  id: string;
  url: string;
  scale: number;
  offset: { x: number; y: number };
  isFlipped: boolean;
}

/**
 * Interface for the AI Studio key selection utility to match global ambient definitions.
 */
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// ブラウザのwindowオブジェクトにaistudioを追加するための定義
declare global {
  interface Window {
    // Fixed: Aligned property type with ambient AIStudio definition to fix mismatch error
    aistudio?: AIStudio;
  }
}
