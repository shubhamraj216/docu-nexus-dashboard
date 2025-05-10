
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDocuments, fetchDocumentStats } from "@/lib/mock-api";
import { Document } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, ArrowDown, ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "createdAt" | "category";
type SortDirection = "asc" | "desc";

export const AllDocuments = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: fetchAllDocuments,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["documentStats"],
    queryFn: fetchDocumentStats,
  });
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const filteredDocuments = documents?.filter((doc) => {
    // Filter by search term
    const matchesSearch = search 
      ? doc.document.toLowerCase().includes(search.toLowerCase()) ||
        doc.category.toLowerCase().includes(search.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      : true;
      
    // Filter by category
    const matchesCategory = selectedCategory 
      ? doc.category === selectedCategory 
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  const sortedDocuments = filteredDocuments?.sort((a, b) => {
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortField === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Button
          variant={sortField === "createdAt" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort("createdAt")}
          className="flex items-center gap-2"
        >
          Date
          {sortField === "createdAt" && (
            sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant={sortField === "category" ? "default" : "outline"}
          size="sm"
          onClick={() => handleSort("category")}
          className="flex items-center gap-2"
        >
          Category
          {sortField === "category" && (
            sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="mesh">Mesh View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="border rounded-md divide-y">
            {docsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex-col md:flex-row md:items-center gap-4">
                  <Skeleton className="h-24 md:h-16 w-full" />
                </div>
              ))
            ) : sortedDocuments?.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try changing your search query or filters
                </p>
              </div>
            ) : (
              sortedDocuments?.map((doc) => (
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
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mesh" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {!statsLoading && stats?.categories.map((category) => (
              <Card 
                key={category} 
                className={`cursor-pointer transition-shadow hover:shadow-md ${
                  selectedCategory === category ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{category}</CardTitle>
                  <CardDescription className="text-xs">
                    {documents?.filter((doc) => doc.category === category).length} documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {documents
                      ?.filter((doc) => doc.category === category)
                      .flatMap((doc) => doc.tags)
                      .filter((tag, index, self) => self.indexOf(tag) === index)
                      .map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-docblue-50">
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))
              : (selectedCategory
                  ? sortedDocuments?.filter((doc) => doc.category === selectedCategory)
                  : sortedDocuments
                )?.map((doc) => (
                  <Link to={`/documents/${doc._id}`} key={doc._id}>
                    <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold truncate">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-docblue-600" />
                            <span className="truncate">
                              {doc.document.length > 30 ? `${doc.document.substring(0, 30)}...` : doc.document}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Badge variant="secondary" className="bg-docblue-100 rounded-sm font-normal">
                            {doc.category}
                          </Badge>
                          
                          <div className="flex flex-wrap gap-1.5">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-1 py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Created: {doc.createdAt}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
