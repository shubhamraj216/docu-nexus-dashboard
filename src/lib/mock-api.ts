
import { Document, DocumentStats } from "./types";

// Sample data
const categories = ["Finance", "Legal", "Marketing", "HR", "Technical"];
const allTags = ["Confidential", "Draft", "Final", "Reviewed", "Approved", "Archived", "Important", "Urgent"];

// Generate random documents
function generateRandomDocuments(count: number): Document[] {
  return Array.from({ length: count }, (_, i) => {
    const randomDate = new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ).toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const randomTags = allTags
      .filter(() => Math.random() > 0.7)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const originalText = `This is the original document #${i + 1} for ${category} department.`;
    const processedText = `Processed document #${i + 1} for ${category} department with tags: ${randomTags.join(", ")}`;
    
    return {
      _id: `doc_${i + 1}`,
      document: processedText,
      category: category,
      tags: randomTags,
      createdAt: randomDate,
      originalDocument: originalText
    };
  });
}

// Mock database
let mockDocuments = generateRandomDocuments(12);

// Mock API functions
export const fetchDocumentStats = async (): Promise<DocumentStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uniqueCategories = Array.from(new Set(mockDocuments.map(doc => doc.category)));
      const uniqueTags = Array.from(new Set(mockDocuments.flatMap(doc => doc.tags)));
      
      resolve({
        totalDocuments: mockDocuments.length,
        categories: uniqueCategories,
        tags: uniqueTags
      });
    }, 500);
  });
};

export const fetchAllDocuments = async (): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDocuments]);
    }, 700);
  });
};

export const fetchDocumentById = async (id: string): Promise<Document | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = mockDocuments.find(doc => doc._id === id);
      resolve(document || null);
    }, 500);
  });
};

export const uploadDocument = async (documentData: Omit<Document, '_id' | 'createdAt'>): Promise<Document> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocument: Document = {
        ...documentData,
        _id: `doc_${mockDocuments.length + 1}`,
        createdAt: new Date().toISOString().split("T")[0] + " " + new Date().toTimeString().split(" ")[0]
      };
      
      mockDocuments.push(newDocument);
      resolve(newDocument);
    }, 800);
  });
};

export const queryDocuments = async (query: string, category?: string, tags?: string[]): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...mockDocuments];
      
      // Filter by query
      if (query) {
        results = results.filter(doc => 
          doc.document.toLowerCase().includes(query.toLowerCase()) || 
          doc.originalDocument.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // Filter by category
      if (category) {
        results = results.filter(doc => doc.category === category);
      }
      
      // Filter by tags
      if (tags && tags.length > 0) {
        results = results.filter(doc => 
          tags.some(tag => doc.tags.includes(tag))
        );
      }
      
      resolve(results);
    }, 700);
  });
};

export const fetchLogs = async (): Promise<{ id: string, documentId: string, action: string, timestamp: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs = mockDocuments.map((doc, index) => ({
        id: `log_${index + 1}`,
        documentId: doc._id,
        action: "Uploaded document",
        timestamp: doc.createdAt
      }));
      
      // Sort by most recent
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      resolve(logs);
    }, 600);
  });
};

export const recalculateDocuments = async (): Promise<{ success: boolean, message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Recalculation completed successfully" });
    }, 1500);
  });
};
