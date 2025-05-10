
export interface Document {
  _id: string;
  document: string;
  category: string;
  tags: string[];
  createdAt: string;
  originalDocument: string;
}

export interface DocumentStats {
  totalDocuments: number;
  categories: string[];
  tags: string[];
}

export interface VisualNode {
  id: string;
  label: string;
  type: "category" | "document" | "tag";
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface VisualLink {
  source: string;
  target: string;
  type: "category-document" | "document-tag";
}
