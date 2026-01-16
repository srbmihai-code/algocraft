export interface TestResult {
  pass: boolean;
  message: string;
}
export type LevelFiles = { html?: string;
  css?: string;
  js?: string;
  instructions?: string
}
export type Question = {
  id: number;
  chapter_name: string;
  level_name: string;
  question: string;
  html_code: string | null;
  css_code: string | null;
  js_code: string | null;
  created_at: string;
  answer?: string | null;
  answered_at?: string | null;
  admin_name?: string | null;
};
