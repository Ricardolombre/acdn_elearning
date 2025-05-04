import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

// Mise à jour du type UserData pour correspondre exactement aux rôles possibles
interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: 'Étudiant' | 'Instructeur' | 'Administrateur';
  dateInscription?: string;
  coursInscrits?: number[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Ajouter ces alias pour la compatibilité
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  async function handleAuthChange(session: Session | null) {
    if (session?.user) {
      setUser(session.user);
      setIsAuthenticated(true);

      // Fetch user profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      // Pour les inscriptions aux cours
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', session.user.id);

      if (enrollmentsError) {
        console.error("Error fetching user enrollments:", enrollmentsError);
      }

      // Vérifier que le rôle est l'un des rôles autorisés
      let validRole: 'Étudiant' | 'Instructeur' | 'Administrateur' = 'Étudiant';
      if (data.role === 'Instructeur' || data.role === 'Administrateur') {
        validRole = data.role;
      }

      // Création du profil utilisateur avec les données
      const profile: UserData = {
        id: data.id,
        email: data.email || session.user.email || '',
        name: data.name,
        avatar: data.avatar,
        role: validRole,
        dateInscription: data.created_at 
          ? new Date(data.created_at).toLocaleDateString() 
          : undefined,
        coursInscrits: enrollments ? enrollments.map(e => e.course_id) : []
      };

      setUserData(profile);
      setIsAdmin(profile.role === 'Administrateur');
    } else {
      setUser(null);
      setUserData(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleAuthChange(session);
      }
    );

    // Initial session check
    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      handleAuthChange(session);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Compte créé avec succès",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
      });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes maintenant déconnecté",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur s'est produite lors de la déconnexion",
      });
      throw error;
    }
  };

  // Ajouter ces alias pour la compatibilité
  const login = signIn;
  const signup = signUp;
  const logout = signOut;

  const value = {
    isAuthenticated,
    loading,
    user,
    userData,
    isAdmin,
    signIn,
    signUp,
    signOut,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
