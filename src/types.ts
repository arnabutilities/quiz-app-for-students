export interface Question {
  id: string | number;
  text: string;
  options: string[]; // typically 4 options, e.g. ["Option A Text", ...]
  correctOption: 'A' | 'B' | 'C' | 'D';
  graphicKeyword?: string; // e.g. 'web', 'safety', 'network', 'email', 'search', 'hardware'
  helpInstruction?: string; // interactive hints / display helper instructions
  explanation: string; // explanation of the correct answer
}

export interface StudentInfo {
  name: string;
  className: string;
  section: string;
  rollNumber: string;
}

export interface QuizSubmission {
  student: StudentInfo;
  answers: Record<string | number, 'A' | 'B' | 'C' | 'D'>;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

export interface AppConfig {
  spreadsheetUrl: string;
  spreadsheetId: string | null;
  clientId: string;
  accessToken: string | null;
  isPublicUrl: boolean;
}
