
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import CourseContentPage from "./pages/CourseContentPage";
import LessonPage from "./pages/LessonPage";
import ResourcesPage from "./pages/ResourcesPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import NotFound from "./pages/NotFound";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/admin/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cours" element={<CoursesPage />} />
            <Route 
              path="/cours/:id" 
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cours/:id/contenu" 
              element={
                <ProtectedRoute>
                  <CourseContentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cours/:courseId/lecon/:lessonId" 
              element={
                <ProtectedRoute>
                  <LessonPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/ressources" element={<ResourcesPage />} />
            <Route path="/communaute" element={<CommunityPage />} />
            <Route path="/a-propos" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/inscription" element={<RegistrationPage />} />
            <Route 
              path="/profil" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
