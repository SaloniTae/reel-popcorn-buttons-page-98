
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import LinksPage from "./pages/admin/LinksPage";
import CreateLinkPage from "./pages/admin/CreateLinkPage";
import LinkDetailPage from "./pages/admin/LinkDetailPage";
import SettingsPage from "./pages/admin/SettingsPage";
import RedirectPage from "./pages/RedirectPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Admin Dashboard Routes */}
              <Route path="/OOR" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="links" element={<LinksPage />} />
                <Route path="links/:id" element={<LinkDetailPage />} />
                <Route path="create" element={<CreateLinkPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Link Redirect Route */}
              <Route path="/r/:shortCode" element={<RedirectPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
