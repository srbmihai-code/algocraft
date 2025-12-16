export interface TestResult {
  pass: boolean;
  message: string;
}
export type LevelFiles = { html?: string;
  css?: string;
  js?: string;
  instructions?: string
}
