
import { useState } from "react";
import { Document } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentVisualization } from "./DocumentVisualization";
import { Grid3X3 } from "lucide-react";
import { NetworkPlot } from "lucide-react";

interface VisualizationWrapperProps {
  documents: Document[];
  meshView: React.ReactNode;
}

export const VisualizationWrapper = ({ documents, meshView }: VisualizationWrapperProps) => {
  const [activeView, setActiveView] = useState<"mesh" | "visualize">("mesh");

  return (
    <Tabs 
      defaultValue="mesh" 
      className="w-full"
      onValueChange={(value) => setActiveView(value as "mesh" | "visualize")}
    >
      <div className="flex justify-end mb-2">
        <TabsList>
          <TabsTrigger value="mesh" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            <span>Mesh View</span>
          </TabsTrigger>
          <TabsTrigger value="visualize" className="flex items-center gap-2">
            <NetworkPlot className="h-4 w-4" />
            <span>Visualize</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="mesh" className="mt-0">
        {meshView}
      </TabsContent>
      
      <TabsContent value="visualize" className="mt-0">
        <DocumentVisualization documents={documents} />
      </TabsContent>
    </Tabs>
  );
};
