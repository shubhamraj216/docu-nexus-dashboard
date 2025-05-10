
import { useQuery } from "@tanstack/react-query";
import { fetchDocumentStats, fetchAllDocuments } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layers, Tags, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardHome = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["documentStats"],
    queryFn: fetchDocumentStats,
  });

  const { data: recentDocs, isLoading: docsLoading } = useQuery({
    queryKey: ["recentDocuments"],
    queryFn: async () => {
      const docs = await fetchAllDocuments();
      return docs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-docblue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Documents
            </CardTitle>
            <FileText className="w-4 h-4 text-docblue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-docblue-800">
                {stats?.totalDocuments || 0}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-docblue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <Layers className="w-4 h-4 text-docblue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-docblue-800">
                {stats?.categories.length || 0}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-docblue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Tags
            </CardTitle>
            <Tags className="w-4 h-4 text-docblue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-docblue-800">
                {stats?.tags.length || 0}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-docblue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Upload
            </CardTitle>
            <Clock className="w-4 h-4 text-docblue-600" />
          </CardHeader>
          <CardContent>
            {docsLoading || !recentDocs?.length ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <div className="text-sm font-medium text-docblue-800">
                {recentDocs[0].createdAt}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {docsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentDocs?.map((doc) => (
                  <div key={doc._id} className="flex items-start space-x-4">
                    <div className="bg-docblue-100 p-2 rounded-md">
                      <FileText className="w-5 h-5 text-docblue-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium leading-none">
                        {doc.document.length > 60 
                          ? `${doc.document.substring(0, 60)}...` 
                          : doc.document}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Category: {doc.category} • {doc.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories & Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats?.categories.map((category) => (
                      <div 
                        key={category}
                        className="bg-docblue-100 text-docblue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {stats?.tags.map((tag) => (
                      <div 
                        key={tag}
                        className="bg-docblue-50 text-docblue-800 border border-docblue-200 px-2 py-1 rounded-md text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
