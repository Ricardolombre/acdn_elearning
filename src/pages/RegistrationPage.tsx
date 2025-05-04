
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { z } from "zod";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profession: "",
    course: "",
    agreeTerms: false
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) {
        toast({
          title: "Erreur lors de l'upload de l'avatar",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }
      
      // Récupérer l'URL publique de l'avatar
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'avatar:", error);
      return null;
    }
  };

  const validateForm = () => {
    // Validation simple
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return false;
    }

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return false;
    }

    // Validation du format email avec zod
    const emailSchema = z.string().email();
    try {
      emailSchema.parse(formData.email);
    } catch (error) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Conditions d'utilisation",
        description: "Vous devez accepter les conditions d'utilisation.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      
      const name = `${formData.firstName} ${formData.lastName}`;
      
      // Modification ici : ne pas tester la valeur de retour de signup
      await signup(formData.email, formData.password, name);
      
      // Récupérer l'utilisateur après inscription
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && avatarFile) {
        const avatarUrl = await uploadAvatar(user.id);
        
        if (avatarUrl) {
          // Mise à jour du profil utilisateur avec l'URL de l'avatar
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ avatar: avatarUrl })
            .eq('id', user.id);
          
          if (profileError) {
            console.error("Erreur lors de la mise à jour du profil:", profileError);
          }
        }
      }
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Inscription</CardTitle>
                <CardDescription>
                  Créez votre compte pour accéder aux formations en droit numérique
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {/* Section Photo de Profil */}
                  <div className="flex flex-col items-center space-y-4">
                    <Label htmlFor="avatar">Photo de profil</Label>
                    <div className="relative h-24 w-24 group">
                      <Avatar className="h-24 w-24 border-2 border-primary">
                        {avatarPreview ? (
                          <AvatarImage src={avatarPreview} alt="Avatar preview" />
                        ) : (
                          <AvatarFallback className="bg-muted">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <label htmlFor="avatar-upload" className="cursor-pointer p-2 bg-white/20 rounded-full">
                          <Camera className="h-6 w-6 text-white" />
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cliquez pour ajouter une photo (optionnel)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Votre prénom" 
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Votre nom" 
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="votre.email@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        placeholder="+242 00 000 0000" 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Votre mot de passe" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirmez votre mot de passe" 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Input 
                      id="profession" 
                      placeholder="Votre profession ou occupation" 
                      value={formData.profession}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cours souhaité</Label>
                    <Select 
                      value={formData.course} 
                      onValueChange={(value) => handleSelectChange("course", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intro">Introduction au Droit Numérique</SelectItem>
                        <SelectItem value="data">Protection des Données Personnelles</SelectItem>
                        <SelectItem value="cybersec">Cybersécurité Juridique</SelectItem>
                        <SelectItem value="ip">Propriété Intellectuelle en Ligne</SelectItem>
                        <SelectItem value="ecommerce">Réglementation du Commerce Électronique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeTerms}
                      onCheckedChange={handleCheckboxChange}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Création du compte...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationPage;
