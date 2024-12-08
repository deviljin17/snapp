export interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  timestamp: number;
  error?: string;
  duration?: number;
}

export interface TestError {
  code: string;
  message: string;
  details?: string;
}