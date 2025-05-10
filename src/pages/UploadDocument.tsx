
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocumentStats, uploadDocument } from "@/lib/mock-api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, X, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const UploadDocument = () => {
  const queryClient = useQueryClient();
  const [document, setDocument] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["documentStats"],
    queryFn: fetchDocumentStats,
  });
  
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentStats"] });
      queryClient.invalidateQueries({ queryKey: ["recentDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      
      // Reset form
      setDocument("");
      setCategory("");
      setTags([]);
      setTagInput("");
      
      toast.success("Document uploaded successfully!");
    },
    onError: () => {
      toast.error("Failed to upload document. Please try again.");
    },
  });
  
  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  
  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSubmit = () => {
    if (!document) {
      toast.error("Document content is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }
    
    uploadMutation.mutate({
      document,
      category,
      tags,
      originalDocument: document,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 bg-docblue-50">
          <CardHeader>
            <CardTitle>Current Stats</CardTitle>
            <CardDescription>System document information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statsLoading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <div>
                  <h4 className="text-sm font-medium">Total Documents</h4>
                  <p className="text-2xl font-bold text-docblue-800">{stats?.totalDocuments || 0}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Categories ({stats?.categories.length})</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stats?.categories.map((cat) => (
                      <div 
                        key={cat}
                        className="bg-white border border-docblue-200 px-2 py-1 rounded-md text-xs flex items-center"
                        onClick={() => setCategory(cat)}
                      >
                        <span>{cat}</span>
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium">Available Tags ({stats?.tags.length})</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stats?.tags.map((tag) => (
                      <div 
                        key={tag}
                        className="bg-white border border-docblue-200 px-2 py-1 rounded-md text-xs flex items-center"
                        onClick={() => !tags.includes(tag) && setTags([...tags, tag])}
                      >
                        <span>{tag}</span>
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>New Document</CardTitle>
            <CardDescription>Enter document details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document">Document Content</Label>
              <Textarea
                id="document"
                placeholder="Enter document content here..."
                className="min-h-[200px]"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex space-x-2">
                <Input
                  id="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1"
                />
              </div>
              {stats && stats.categories.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Tip: Click on a category from the left to auto-fill
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex space-x-2">
                <Input
                  id="tags"
                  placeholder="Enter tag and press Add"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleTagAdd}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <div 
                      key={tag}
                      className="bg-docblue-100 px-2 py-1 rounded-md text-xs flex items-center group"
                    >
                      <span>{tag}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleTagRemove(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {stats && stats.tags.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Tip: Click on a tag from the left to add it
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={uploadMutation.isPending || !document || !category}>
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Document"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Document Upload</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to upload this document? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Confirm Upload
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
