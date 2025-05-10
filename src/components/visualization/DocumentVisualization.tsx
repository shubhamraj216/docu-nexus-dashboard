
import { useEffect, useRef, useState } from "react";
import { Document, VisualNode, VisualLink } from "@/lib/types";
import * as d3 from "d3";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentVisualizationProps {
  documents: Document[];
}

export const DocumentVisualization = ({ documents }: DocumentVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Document | null>(null);
  
  useEffect(() => {
    if (!documents.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create unique lists of categories and tags
    const categories = Array.from(new Set(documents.map(d => d.category)));
    const allTags = documents.flatMap(d => d.tags);
    const uniqueTags = Array.from(new Set(allTags));

    // Create nodes for categories, documents, and tags
    const categoryNodes: VisualNode[] = categories.map(category => ({
      id: `category-${category}`,
      label: category,
      type: "category",
      radius: 40,
    }));

    const documentNodes: VisualNode[] = documents.map(doc => ({
      id: `document-${doc._id}`,
      label: doc.document.substring(0, 30) + (doc.document.length > 30 ? "..." : ""),
      type: "document",
      radius: 25,
      docData: doc,
    }));

    const tagNodes: VisualNode[] = uniqueTags.map(tag => ({
      id: `tag-${tag}`,
      label: tag,
      type: "tag", 
      radius: 15,
    }));

    const nodes: VisualNode[] = [...categoryNodes, ...documentNodes, ...tagNodes];

    // Create links between nodes
    const links: VisualLink[] = [
      // Links from categories to documents
      ...documents.map(doc => ({
        source: `category-${doc.category}`,
        target: `document-${doc._id}`,
        type: "category-document" as const,
      })),
      // Links from documents to tags
      ...documents.flatMap(doc => 
        doc.tags.map(tag => ({
          source: `document-${doc._id}`,
          target: `tag-${tag}`,
          type: "document-tag" as const,
        }))
      )
    ];

    // Set up the simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("collide", d3.forceCollide().radius(d => (d as any).radius + 10))
      .force("link", d3.forceLink(links).id(d => (d as any).id).distance(100));

    // Create the links
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => d.type === "document-tag" ? 1 : 2)
      .attr("stroke-dasharray", d => d.type === "document-tag" ? "3,3" : "none");

    // Create the nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => {
        if (d.type === "category") return "#9b87f5";
        if (d.type === "document") return "#6E59A5";
        return "#F97316"; // tag
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event, d: any) {
        d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
        if (d.type === "document" && d.docData) {
          setHoveredNode(d.docData);
        }
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1.5);
        setHoveredNode(null);
      })
      .call(drag(simulation) as any);

    // Add labels to nodes
    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.label)
      .attr("font-size", d => {
        if (d.type === "category") return "12px";
        if (d.type === "document") return "10px";
        return "8px";
      })
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === "document" ? "40px" : "30px")
      .attr("fill", "#333");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("cx", d => Math.max(d.radius, Math.min(width - d.radius, d.x as number)))
        .attr("cy", d => Math.max(d.radius, Math.min(height - d.radius, d.y as number)));

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    // Define drag behavior
    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => {
      simulation.stop();
    };
  }, [documents]);

  return (
    <div className="relative w-full">
      <div className="absolute top-2 left-2 z-10 p-2">
        <div className="flex gap-2 items-center text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#9b87f5]"></div>
            <span>Categories</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#6E59A5]"></div>
            <span>Documents</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#F97316]"></div>
            <span>Tags</span>
          </div>
        </div>
      </div>
      
      <svg ref={svgRef} className="w-full h-[70vh] border rounded-lg bg-white/50" />
      
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 max-w-md">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Document: {hoveredNode._id}</h3>
              <p className="text-sm mb-2 text-muted-foreground">
                Category: {hoveredNode.category}
              </p>
              <p className="text-sm whitespace-pre-wrap">
                {hoveredNode.document.length > 200 
                  ? hoveredNode.document.substring(0, 200) + "..."
                  : hoveredNode.document
                }
              </p>
              {hoveredNode.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {hoveredNode.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
