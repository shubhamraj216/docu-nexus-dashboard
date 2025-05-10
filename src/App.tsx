
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/layout/Dashboard";
import { DashboardHome } from "./pages/DashboardHome";
import { UploadDocument } from "./pages/UploadDocument";
import { AllDocuments } from "./pages/AllDocuments";
import { DocumentDetail } from "./pages/DocumentDetail";
import { QueryDocuments } from "./pages/QueryDocuments";
import { DocumentLogs } from "./pages/DocumentLogs";
import { Recalculate } from "./pages/Recalculate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/upload" element={<UploadDocument />} />
            <Route path="/documents" element={<AllDocuments />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/query" element={<QueryDocuments />} />
            <Route path="/logs" element={<DocumentLogs />} />
            <Route path="/recalculate" element={<Recalculate />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
