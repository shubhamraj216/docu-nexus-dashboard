
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
