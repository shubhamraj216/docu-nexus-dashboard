
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDocumentById } from "@/lib/mock-api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, FileText, Tag, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: document, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => (id ? fetchDocumentById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-64" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <FileText className="h-16 w-16 text-muted-foreground opacity-20" />
        <h2 className="mt-4 text-2xl font-semibold">Document Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The document you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link to="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/documents">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Documents
          </Link>
        </Button>
        
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Document #{document._id.replace('doc_', '')}
        </h1>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Content</CardTitle>
              <CardDescription>Processed content from the document</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{document.document}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Original Document</CardTitle>
              <CardDescription>Original unprocessed content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{document.originalDocument}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-docblue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Created At</h4>
                  <p className="text-sm text-muted-foreground">{document.createdAt}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Layers className="h-5 w-5 text-docblue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <Badge className="mt-1">{document.category}</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-docblue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {document.tags.length > 0 ? (
                      document.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-docblue-50">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/documents`}>View All Documents</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
