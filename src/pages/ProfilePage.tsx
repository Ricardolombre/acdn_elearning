
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { UserRound, Calendar, BookOpen, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CourseType } from "@/components/courses/CourseCard";
import { Progress } from "@/components/ui/progress";
import { fetchUserEnrolledCourses } from "@/services/lessonService";
import { fetchAllCourses } from "@/services/courseService";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { isAuthenticated, userData, loading } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<CourseType[]>([]);
  const [activeTab, setActiveTab] = useState("information");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("ProfilePage - Auth state:", { isAuthenticated, userData, loading });
    
    if (loading) {
      return; // Wait for auth to initialize
    }
    
    if (!isAuthenticated || !userData) {
      navigate("/login", { state: { from: location } });
      return;
    }

    // Récupérer les cours auxquels l'utilisateur est inscrit depuis la base de données
    const loadEnrolledCourses = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les IDs des cours auxquels l'utilisateur est inscrit
        const enrolledCourseIds = await fetchUserEnrolledCourses(userData.id);
        
        if (enrolledCourseIds.length > 0) {
          // Récupérer tous les cours
          const allCourses = await fetchAllCourses();
          
          // Filtrer les cours auxquels l'utilisateur est inscrit
          const userCourses = allCourses.filter(course => 
            enrolledCourseIds.includes(course.id)
          );
          
          setEnrolledCourses(userCourses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des cours:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos cours. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEnrolledCourses();
  }, [isAuthenticated, navigate, userData, loading, toast]);

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <Progress value={75} className="w-1/2 mx-auto mb-4" />
              <p>Chargement de votre profil...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !userData) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
            
            {/* Section d'informations utilisateur */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold">{userData.name || "Utilisateur"}</h2>
                    <p className="text-gray-600">{userData.email}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                      <Badge variant={userData.role === "Administrateur" ? "destructive" : userData.role === "Instructeur" ? "outline" : "secondary"}>
                        {userData.role || "Étudiant"}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> 
                        Inscrit depuis: {userData.dateInscription || "Récemment"}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" /> 
                        {enrolledCourses.length} cours suivis
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Onglets pour les différentes sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="information" className="flex-1">Information</TabsTrigger>
                <TabsTrigger value="courses" className="flex-1">Mes cours</TabsTrigger>
                <TabsTrigger value="certificates" className="flex-1">Certificats</TabsTrigger>
              </TabsList>
              
              {/* Onglet Informations */}
              <TabsContent value="information">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-gray-500">Nom complet</h3>
                        <p>{userData.name || "Non renseigné"}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-500">Email</h3>
                        <p>{userData.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-500">Rôle</h3>
                        <p>{userData.role || "Étudiant"}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-500">Date d'inscription</h3>
                        <p>{userData.dateInscription || "Date non disponible"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Onglet Cours */}
              <TabsContent value="courses">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {enrolledCourses.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Niveau</TableHead>
                            <TableHead>Instructeur</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrolledCourses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.category}</TableCell>
                              <TableCell>{course.level}</TableCell>
                              <TableCell>{course.instructor}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/cours/${course.id}/contenu`)}
                                >
                                  Continuer
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4">Vous n'êtes inscrit(e) à aucun cours pour le moment.</p>
                        <Button onClick={() => navigate('/cours')} className="mt-4">
                          Découvrir les cours
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Onglet Certificats */}
              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>Mes certificats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Award className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4">Vous n'avez pas encore obtenu de certificat.</p>
                      <p className="mt-2">Terminez vos cours pour gagner des certificats!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
