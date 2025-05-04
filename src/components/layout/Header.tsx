
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userData, logout } = useAuth();
  
  // Fonction pour obtenir les initiales du nom de l'utilisateur pour l'avatar
  const getUserInitials = () => {
    if (!userData?.name) return "U";
    return userData.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-acdn-blue font-bold text-2xl">ACDN</span>
          <span className="hidden md:block text-acdn-gray text-sm">Association Congolaise du Droit Numérique</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-acdn-blue transition-colors">
            Accueil
          </Link>
          <Link to="/cours" className="text-gray-700 hover:text-acdn-blue transition-colors">
            Cours
          </Link>
          <Link to="/ressources" className="text-gray-700 hover:text-acdn-blue transition-colors">
            Ressources
          </Link>
          <Link to="/communaute" className="text-gray-700 hover:text-acdn-blue transition-colors">
            Communauté
          </Link>
          <Link to="/a-propos" className="text-gray-700 hover:text-acdn-blue transition-colors">
            À propos
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData?.avatar || ""} alt={userData?.name} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{userData?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  <p className="text-muted-foreground">Connecté en tant que</p>
                  <p className="truncate">{userData?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profil" className="cursor-pointer w-full flex items-center">
                    <User size={16} className="mr-2" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                {userData?.role === "Administrateur" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer w-full flex items-center">
                      <Settings size={16} className="mr-2" />
                      Administration
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <User size={16} />
                <span>Connexion</span>
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100">
              Accueil
            </Link>
            <Link to="/cours" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100">
              Cours
            </Link>
            <Link to="/ressources" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100">
              Ressources
            </Link>
            <Link to="/communaute" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100">
              Communauté
            </Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100">
              À propos
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center py-2 border-b border-gray-100">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={userData?.avatar || ""} alt={userData?.name} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userData?.name}</p>
                    <p className="text-sm text-gray-500">{userData?.email}</p>
                  </div>
                </div>
                
                <Link to="/profil" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100 flex items-center">
                  <User size={16} className="mr-2" />
                  Mon profil
                </Link>
                
                {userData?.role === "Administrateur" && (
                  <Link to="/admin" className="text-gray-700 hover:text-acdn-blue transition-colors py-2 border-b border-gray-100 flex items-center">
                    <Settings size={16} className="mr-2" />
                    Administration
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 py-2 flex items-center">
                  <LogOut size={16} className="mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="py-2">
                <Button className="w-full flex items-center justify-center space-x-1">
                  <User size={16} />
                  <span>Connexion</span>
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
