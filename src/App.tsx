import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import N8nChatWidget from "./components/N8nChatWidget";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* English routes */}
    <Route path="/" element={<Index />} />
    <Route path="/post/:id" element={<BlogPost />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    
    {/* Chinese routes */}
    <Route path="/zh-tw" element={<Index />} />
    <Route path="/zh-tw/post/:id" element={<BlogPost />} />
    <Route path="/zh-tw/auth" element={<Auth />} />
    <Route path="/zh-tw/reset-password" element={<ResetPassword />} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </BrowserRouter>
        <N8nChatWidget />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
