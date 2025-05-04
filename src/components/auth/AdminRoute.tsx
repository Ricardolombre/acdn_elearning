
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  if (!isAuthenticated) {
    // Rediriger vers la page de connexion si non connecté
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    // Afficher un toast d'erreur
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les droits d'administration nécessaires.",
      variant: "destructive",
    });
    
    // Rediriger vers la page d'accueil si connecté mais pas administrateur
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
