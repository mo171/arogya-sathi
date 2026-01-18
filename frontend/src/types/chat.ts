export interface Message {
  id: string;
  type: "user" | "ai";
  content?: string;
  cards?: {
    type: "problem" | "remedy" | "doctor";
    data: any;
  }[];
}

export interface HealthSession {
  id: string;
  user_id: string;
  audio_transcript?: string;
  detected_language?: string;
  analysis_result?: AnalysisResult;
  recommendations?: {
    doctors: DoctorRecommendation[];
  };
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface AnalysisResult {
  symptoms: string[];
  severity: "low" | "medium" | "high";
  diagnosis: string;
  description: string;
  home_remedies?: HomeRemedy[];
}

export interface HomeRemedy {
  name: string;
  description: string;
  duration: string;
}

export interface DoctorRecommendation {
  name: string;
  specialty: string;
  distance: string;
  rating: number;
  available: string;
  phone?: string;
  address?: string;
}

export interface SessionResponse {
  session_id: string;
  status_code: number;
}

export interface ProcessAudioResponse {
  analysis: AnalysisResult;
  doctors: DoctorRecommendation[];
  status_code: number;
}
