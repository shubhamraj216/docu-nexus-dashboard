
import { useQuery } from "@tanstack/react-query";
import { fetchAllDocuments } from "@/lib/mock-api";
import { VisualizationWrapper } from "@/components/visualization/VisualizationWrapper";
import { useState } from "react";
import { Link } from "react-router-dom";
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

export const AllDocuments = () => {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchAllDocuments,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract unique categories and tags from documents
  const categories = [...new Set(documents.map(doc => doc.category))];
  const allTags = documents.flatMap(doc => doc.tags);
  const uniqueTags = [...new Set(allTags)];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter documents based on search criteria
  const filteredDocuments = documents.filter(doc => {
    const matchesQuery = searchQuery === "" || 
      doc.document.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || 
      doc.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => doc.tags.includes(tag));
    
    return matchesQuery && matchesCategory && matchesTags;
  });

  const MeshView = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="md:w-1/3 flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setSelectedCategory("");
            setSelectedTags([]);
          }}>
            Clear
          </Button>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleTagToggle(tag)}
            >
              {tag} &times;
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc._id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">
                <Link to={`/documents/${doc._id}`} className="hover:underline">
                  {doc.document.length > 60 
                    ? `${doc.document.substring(0, 60)}...` 
                    : doc.document}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <Badge variant="outline">{doc.category}</Badge>
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {doc.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs cursor-pointer"
                    onClick={() => {
                      if (!selectedTags.includes(tag)) {
                        handleTagToggle(tag);
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 border rounded-md">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search criteria or add new documents.
          </p>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
      
      <div className="bg-card rounded-lg p-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium mb-2">Filter by tags</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.map((tag) => (
              <Badge 
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <VisualizationWrapper 
        documents={filteredDocuments} 
        meshView={<MeshView />}
      />
    </div>
  );
};
