
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the 'from' path from location state or default to '/'
  const from = location.state?.from?.pathname || "/";

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      // Modification ici : ne pas tester la valeur de retour de login
      await login(email, password);
      
      // Si login est réussi (pas d'erreur lancée), naviguer
      navigate(from, { replace: true });
      
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous pour accéder à vos formations en droit numérique
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre.email@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <a 
                        href="#" 
                        className="text-xs text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          // Ici vous pouvez ajouter une logique pour le mot de passe oublié
                          alert("Fonctionnalité à venir");
                        }}
                      >
                        Mot de passe oublié?
                      </a>
                    </div>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={handleTogglePassword}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Se souvenir de moi
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Connexion en cours...
                      </>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                  <p className="text-center text-sm">
                    Vous n'avez pas de compte?{" "}
                    <a 
                      href="/inscription"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/inscription");
                      }}
                    >
                      S'inscrire
                    </a>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
