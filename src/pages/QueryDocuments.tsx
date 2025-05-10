
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { queryDocuments, fetchDocumentStats } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export const QueryDocuments = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerms, setSearchTerms] = useState<{ 
    query: string;
    category: string;
    tags: string[];
  } | null>(null);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["documentStats"],
    queryFn: fetchDocumentStats,
  });
  
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["searchResults", searchTerms],
    queryFn: () => {
      if (!searchTerms) return Promise.resolve([]);
      return queryDocuments(
        searchTerms.query,
        searchTerms.category || undefined,
        searchTerms.tags.length > 0 ? searchTerms.tags : undefined
      );
    },
    enabled: !!searchTerms,
  });
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const handleSearch = () => {
    if (!query && !selectedCategory && selectedTags.length === 0) {
      toast.error("Please enter at least one search criterion");
      return;
    }
    
    setIsSearching(true);
    setSearchTerms({
      query,
      category: selectedCategory,
      tags: selectedTags,
    });
  };
  
  const handleClear = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSearchTerms(null);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Query Documents</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Search Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Search Text</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="query"
                  placeholder="Enter search text..."
                  className="pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any category</SelectItem>
                  {statsLoading 
                    ? <SelectItem value="" disabled>Loading categories...</SelectItem>
                    : stats?.categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Tags</Label>
              <Card className="border-dashed">
                <CardContent className="p-3 space-y-2">
                  {statsLoading ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : stats?.tags.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-1">
                      No tags available
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {stats?.tags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tag-${tag}`}
                            checked={selectedTags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <label
                            htmlFor={`tag-${tag}`}
                            className="text-sm cursor-pointer truncate"
                          >
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedTags.map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5 cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag} &times;
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search Documents
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {isSearching
                ? resultsLoading
                  ? "Searching Documents..."
                  : `Search Results (${results?.length || 0})`
                : "Query Results"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-semibold">Enter search criteria</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                  Use the form on the left to search through documents by text, category, or tags.
                </p>
              </div>
            ) : resultsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : results?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search criteria to find more documents.
                </p>
              </div>
            ) : (
              <div className="border rounded-md divide-y">
                {results?.map((doc) => (
                  <div key={doc._id} className="p-4 hover:bg-muted/40">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-docblue-600 flex-shrink-0" />
                          <Link
                            to={`/documents/${doc._id}`}
                            className="font-medium truncate hover:text-primary hover:underline"
                          >
                            {doc.document.length > 60 ? `${doc.document.substring(0, 60)}...` : doc.document}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>Created: {doc.createdAt}</span>
                          <span>•</span>
                          <Badge variant="outline">{doc.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-end">
                        {doc.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-docblue-50 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
