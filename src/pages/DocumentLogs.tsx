
import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/lib/mock-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logs, FileText, Search } from "lucide-react";
import { useState } from "react";

export const DocumentLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: logs, isLoading } = useQuery({
    queryKey: ["documentLogs"],
    queryFn: fetchLogs,
  });
  
  const filteredLogs = logs?.filter(log => 
    log.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Document Logs</h1>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Logs className="h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-semibold">No logs found</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
                {searchTerm ? "Try adjusting your search term to find logs." : "No document activity has been recorded yet."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="bg-muted/50 p-3 grid grid-cols-12 text-sm font-medium text-muted-foreground">
                <div className="col-span-2">Time</div>
                <div className="col-span-2">Document ID</div>
                <div className="col-span-6">Action</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              <div className="divide-y">
                {filteredLogs?.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 p-3 items-center">
                    <div className="col-span-2 text-sm">{log.timestamp}</div>
                    <div className="col-span-2 font-mono text-xs">{log.documentId}</div>
                    <div className="col-span-6">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-docblue-600" />
                        <span>{log.action}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Success
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
