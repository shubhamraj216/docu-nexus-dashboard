
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { recalculateDocuments } from "@/lib/mock-api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Settings, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Recalculate = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const recalculateMutation = useMutation({
    mutationFn: recalculateDocuments,
    onSuccess: (data) => {
      if (data.success) {
        setShowSuccess(true);
        toast.success("Recalculation completed successfully");
      } else {
        toast.error("Recalculation failed");
      }
    },
    onError: () => {
      toast.error("Recalculation failed. Please try again.");
    },
  });
  
  const handleRecalculate = () => {
    setShowSuccess(false);
    recalculateMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Recalculate</h1>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Recalculate Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Perform a recalculation of all documents in the system. This process may take some time depending on the number of documents.
            </p>
            
            {showSuccess && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-md flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <h4 className="font-medium text-green-800">Success!</h4>
                  <p className="text-sm text-green-700">
                    The recalculation was completed successfully.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={recalculateMutation.isPending} 
                  className="w-full"
                >
                  {recalculateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recalculating...
                    </>
                  ) : (
                    "Recalculate All Documents"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Recalculation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to recalculate all documents? This process cannot be interrupted once started.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRecalculate}>
                    Confirm
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
