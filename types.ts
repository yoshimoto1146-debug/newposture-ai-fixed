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
  beforeScore: number; // 0-100
  afterScore: number;  // 0-100
  description: string;
  status: 'improved' | 'same' | 'needs-attention';
}

export interface AnalysisResults {
  viewA: {
    type: ViewType;
    beforeLandmarks: PostureLandmarks;
    afterLandmarks: PostureLandmarks;
  };
  viewB?: {
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
