import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LessonList from "@/components/courses/LessonList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChevronLeft, BookOpen, Users, Calendar, CheckCircle, Award } from "lucide-react";
import { CourseType } from "@/components/courses/CourseCard";
import { LessonType } from "@/data/lessons";
import { fetchCourseById } from "@/services/courseService";
import { 
  fetchLessonsByCourseId, 
  fetchUserLessonProgressByCourse,
  enrollUserInCourse,
  checkUserEnrollment 
} from "@/services/lessonService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const CourseContentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<CourseType | null>(null);
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("contenu");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données du cours
        const courseId = parseInt(id || "0");
        const courseData = await fetchCourseById(courseId);
        
        if (courseData) {
          setCourse(courseData);
          
          // Récupérer les leçons du cours
          const lessonsData = await fetchLessonsByCourseId(courseId);
          setLessons(lessonsData);
          
          // Récupérer la progression de l'utilisateur si connecté
          if (userData?.id) {
            // Vérifier l'inscription au cours
            const enrolled = await checkUserEnrollment(userData.id, courseId);
            setIsEnrolled(enrolled);
            
            // Si l'utilisateur n'est pas encore inscrit, l'inscrire automatiquement
            if (!enrolled) {
              try {
                await enrollUserInCourse(userData.id, courseId);
                setIsEnrolled(true);
                toast({
                  title: "Inscription réussie",
                  description: "Vous êtes maintenant inscrit à ce cours.",
                });
              } catch (enrollError) {
                console.error("Erreur lors de l'inscription au cours:", enrollError);
              }
            }
            
            // Charger la progression des leçons
            const progress = await fetchUserLessonProgressByCourse(courseId, userData.id);
            const completedCount = Object.values(progress).filter(completed => completed).length;
            setCompletedLessonsCount(completedCount);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du cours. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourseData();
  }, [id, isAuthenticated, userData?.id, navigate, toast]);

  // Calculer le pourcentage de progression
  const progressPercentage = lessons.length > 0 
    ? Math.round((completedLessonsCount / lessons.length) * 100) 
    : 0;

  // Si le cours n'est pas trouvé
  if (!isLoading && !course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertTitle>Cours non trouvé</AlertTitle>
            <AlertDescription>
              Le cours que vous recherchez n'existe pas.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate("/cours")}>
              Retour à la liste des cours
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Trouver la prochaine leçon non complétée
  const findNextIncompleteLesson = () => {
    if (lessons.length === 0 || completedLessonsCount >= lessons.length) return null;
    
    // Trier les leçons par ordre
    const orderedLessons = [...lessons].sort((a, b) => a.lesson_order - b.lesson_order);
    
    // Trouver la première leçon non verrouillée qui n'est pas complétée
    for (const lesson of orderedLessons) {
      if (!lesson.is_locked) {
        return lesson;
      }
    }
    
    return null;
  };

  const nextLesson = findNextIncompleteLesson();
  
  const handleContinueLearning = async () => {
    if (!userData?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour continuer l'apprentissage.",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier si l'utilisateur est inscrit, et l'inscrire s'il ne l'est pas
    if (!isEnrolled) {
      try {
        await enrollUserInCourse(userData.id, parseInt(id || "0"));
        setIsEnrolled(true);
      } catch (error) {
        console.error("Erreur lors de l'inscription au cours:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vous inscrire à ce cours. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Continuer vers la prochaine leçon
    const nextLesson = findNextIncompleteLesson();
    if (nextLesson) {
      navigate(`/cours/${id}/lecon/${nextLesson.id}`);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-6 md:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
              <p>Chargement...</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/cours/${id}`)}
                  className="mb-6 gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Retour au cours
                </Button>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-4">{course?.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {course?.category}
                    </Badge>
                    <Badge className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {course?.level}
                    </Badge>
                    <Badge className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {course?.duration}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4">{course?.description}</p>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" /> {course?.enrolled_count} apprenants
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne de gauche: Contenu du cours */}
                <div className="lg:col-span-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="contenu" className="flex-1">Contenu du cours</TabsTrigger>
                      <TabsTrigger value="infos" className="flex-1">Informations</TabsTrigger>
                      <TabsTrigger value="discussions" className="flex-1">Discussions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="contenu">
                      <LessonList courseId={parseInt(id || "0")} />
                    </TabsContent>
                    
                    <TabsContent value="infos">
                      <Card>
                        <CardHeader>
                          <CardTitle>À propos de ce cours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>Ce cours complet vous guidera à travers tous les aspects essentiels du {course?.title}.</p>
                          
                          <Accordion type="single" collapsible className="mt-4">
                            <AccordionItem value="objectives">
                              <AccordionTrigger>Objectifs d'apprentissage</AccordionTrigger>
                              <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>Comprendre les principes fondamentaux du droit numérique congolais</li>
                                  <li>Maîtriser les concepts juridiques essentiels applicables au numérique</li>
                                  <li>Appliquer les connaissances acquises à des cas pratiques</li>
                                  <li>Développer un esprit critique face aux enjeux juridiques du numérique</li>
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="prerequisites">
                              <AccordionTrigger>Prérequis</AccordionTrigger>
                              <AccordionContent>
                                <p>Aucun prérequis spécifique n'est nécessaire pour suivre ce cours. Une curiosité pour les aspects juridiques du numérique est toutefois recommandée.</p>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="instructor">
                              <AccordionTrigger>À propos de l'instructeur</AccordionTrigger>
                              <AccordionContent>
                                <div>
                                  <h4 className="font-medium mb-2">{course?.instructor}</h4>
                                  <p className="text-gray-600">Expert en droit numérique avec plus de 10 ans d'expérience dans le domaine juridique au Congo. Professeur à l'Université de Kinshasa et consultant pour plusieurs organisations internationales.</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="discussions">
                      <Card>
                        <CardHeader>
                          <CardTitle>Forum de discussion</CardTitle>
                          <CardDescription>Échangez avec les autres apprenants et l'instructeur</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-center py-8 text-gray-500">
                            Les discussions pour ce cours seront bientôt disponibles.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Colonne de droite: Progression et infos */}
                <div>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Votre progression</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {completedLessonsCount} leçon{completedLessonsCount !== 1 ? 's' : ''} sur {lessons.length} terminée{completedLessonsCount !== 1 ? 's' : ''} ({progressPercentage}%)
                        </p>
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 mr-2" /> {lessons.length} leçons
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" /> {course?.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-2" /> Auto-évaluations incluses
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" /> Certificat à la fin
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full mt-6"
                        onClick={handleContinueLearning}
                        disabled={!nextLesson}
                      >
                        {nextLesson ? "Continuer l'apprentissage" : "Toutes les leçons terminées"}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ressources supplémentaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li>
                          <a href="#" className="text-blue-600 hover:underline flex items-center">
                            <span className="mr-2">📄</span> Guide pratique (PDF)
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-blue-600 hover:underline flex items-center">
                            <span className="mr-2">📊</span> Présentation du cours
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-blue-600 hover:underline flex items-center">
                            <span className="mr-2">🔗</span> Liens utiles
                          </a>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CourseContentPage;
