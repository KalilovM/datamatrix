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

export const AGGREGATED_CODES_PAGE_SIZE = 10;

export interface Filters {
  name?: string;
  modelArticle?: string;
  color?: string;
  generatedCode?: string;
}

export interface AggregatedCodesResponse {
  items: IAggregatedCode[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
