export interface IAggregatedCode {
  name: string;
  modelArticle: string;
  size: string;
  color: string;
  generatedCode: string;
  configuration: string;
  codes?: string[];
  type: string;
  createdAt: Date;
}

export interface Filters {
  name?: string;
  modelArticle?: string;
  color?: string;
  generatedCode?: string;
}
