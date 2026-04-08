import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/app-layout";
import HomePage from "@/pages/home";
import TrimPage from "@/pages/trim";
import ExplorePage from "@/pages/explore";
import ConvertPage from "@/pages/convert";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider delay={300}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/trim" element={<TrimPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/convert" element={<ConvertPage />} />
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>
);
