
import { useState, useEffect } from "react";
import { LessonType } from "@/data/lessons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Lock, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchLessonsByCourseId, fetchUserLessonProgressByCourse, updateLessonProgress } from "@/services/lessonService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface LessonListProps {
  courseId: number;
}

const LessonList = ({ courseId }: LessonListProps) => {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les leçons depuis Supabase
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        const lessonsData = await fetchLessonsByCourseId(courseId);
        setLessons(lessonsData);

        // Si l'utilisateur est connecté, récupérer sa progression
        if (isAuthenticated && userData?.id) {
          const progress = await fetchUserLessonProgressByCourse(courseId, userData.id);
          const completedIds = Object.entries(progress)
            .filter(([_, completed]) => completed)
            .map(([id, _]) => parseInt(id));
          setCompletedLessons(completedIds);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des leçons:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les leçons. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [courseId, isAuthenticated, userData?.id, toast]);

  const handleStartLesson = (lessonId: number) => {
    navigate(`/cours/${courseId}/lecon/${lessonId}`);
  };

  const toggleLessonCompletion = async (lessonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour suivre votre progression.",
        variant: "destructive",
      });
      return;
    }

    try {
      const isCompleted = completedLessons.includes(lessonId);
      
      // Mettre à jour l'interface immédiatement pour une meilleure réactivité
      setCompletedLessons(prev => 
        isCompleted 
          ? prev.filter(id => id !== lessonId)
          : [...prev, lessonId]
      );

      // Enregistrer le changement dans la base de données
      if (userData?.id) {
        await updateLessonProgress(lessonId, userData.id, !isCompleted);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre progression. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <p>Chargement des leçons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Contenu du cours</h2>
      
      {lessons.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border">
          <p className="text-gray-600">Aucune leçon n'est disponible pour ce cours actuellement.</p>
        </div>
      ) : (
        lessons.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id);
          
          return (
            <Card 
              key={lesson.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${isCompleted ? 'border-l-4 border-l-green-500' : ''}`}
              onClick={() => !lesson.is_locked && handleStartLesson(lesson.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={isCompleted ? "outline" : "secondary"} className="text-xs">
                        Leçon {lesson.lesson_order}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.duration}
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      {lesson.title}
                    </CardTitle>
                  </div>
                  <div>
                    {isCompleted ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600"
                        onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                    ) : lesson.is_locked ? (
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        <Lock className="h-3 w-3 mr-1" /> Verrouillé
                      </Badge>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => toggleLessonCompletion(lesson.id, e)}
                      >
                        Marquer comme terminé
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              <CardDescription className="text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                
                <div className="mt-4 flex justify-between items-center">
                  {!lesson.is_locked ? (
                    <Button size="sm" className="gap-2">
                      <Play className="h-4 w-4" /> Commencer
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled className="gap-2">
                      <Lock className="h-4 w-4" /> Déverrouiller
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default LessonList;
