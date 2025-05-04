
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LessonType } from "@/data/lessons";
import { LessonForm } from "./LessonForm";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchLessonsByCourseId,
  addLesson,
  updateLesson,
  deleteLesson
} from "@/services/lessonService";
import { Console } from "console";

interface LessonManagerProps {
  courseId: number;
}

const LessonManager = ({ courseId }: LessonManagerProps) => {
  const [lessons, setLessons] = useState<LessonType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        const lessonsData = await fetchLessonsByCourseId(courseId);
        setLessons(lessonsData);
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
  }, [courseId, toast]);

  const handleAddLesson = () => {
    setEditingLesson(null);
    setShowForm(true);
  };

  const handleEditLesson = (lesson: LessonType) => {
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      toast({
        title: "Leçon supprimée",
        description: "La leçon a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la leçon:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la leçon. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLesson = async (lesson: LessonType) => {
    try {
      if (editingLesson) {
        // Mise à jour d'une leçon existante
        const updatedLesson = await updateLesson(lesson);
        setLessons(lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l));
        toast({
          title: "Leçon mise à jour",
          description: "La leçon a été mise à jour avec succès.",
        });
      } else {
        // Ajout d'une nouvelle leçon
        const newLesson = await addLesson(lesson);
        console.log("Nouvelle leçon ajoutée:", newLesson);
        setLessons([...lessons, newLesson]);
        toast({
          title: "Leçon ajoutée",
          description: "La nouvelle leçon a été ajoutée avec succès.",
        });
      }
      setShowForm(false);
      setEditingLesson(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la leçon:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la leçon. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingLesson(null);
  };

  const handleToggleLock = async (lesson: LessonType) => {
    try {
      const updatedLesson = { ...lesson, isLocked: !lesson.is_locked };
      await updateLesson(updatedLesson);
      setLessons(lessons.map(l => l.id === lesson.id ? updatedLesson : l));
      toast({
        title: updatedLesson.isLocked ? "Leçon verrouillée" : "Leçon déverrouillée",
        description: `La leçon a été ${updatedLesson.isLocked ? "verrouillée" : "déverrouillée"} avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut de la leçon:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la leçon. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  const handleMoveLesson = async (lessonId: number, direction: 'up' | 'down') => {
    try {
      const orderedLessons = [...lessons].sort((a, b) => a.lesson_order - b.lesson_order);
      const lessonIndex = orderedLessons.findIndex(l => l.id === lessonId);
      
      if ((direction === 'up' && lessonIndex === 0) || 
          (direction === 'down' && lessonIndex === orderedLessons.length - 1)) {
        return; // Déjà en haut/bas, ne rien faire
      }

      const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
      const targetLesson = orderedLessons[targetIndex];
      
      // Échanger les ordres des leçons
      const currentLesson = { ...orderedLessons[lessonIndex], order: targetLesson.lesson_order };
      const swappedTargetLesson = { ...targetLesson, order: orderedLessons[lessonIndex].lesson_order };

      // Mettre à jour dans la base de données
      await updateLesson(currentLesson);
      await updateLesson(swappedTargetLesson);

      // Mettre à jour l'état local
      setLessons(lessons.map(l => {
        if (l.id === lessonId) return currentLesson;
        if (l.id === targetLesson.id) return swappedTargetLesson;
        return l;
      }));
    } catch (error) {
      console.error("Erreur lors du déplacement de la leçon:", error);
      toast({
        title: "Erreur",
        description: "Impossible de déplacer la leçon. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des leçons</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
          <p>Chargement des leçons...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des leçons</CardTitle>
        <Button onClick={handleAddLesson}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une leçon
        </Button>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <LessonForm 
            lesson={editingLesson} 
            courseId={courseId}
            onSave={handleSaveLesson} 
            onCancel={handleCancelForm} 
          />
        ) : (
          <>
            {lessons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune leçon n'a été créée pour ce cours</p>
                <Button onClick={handleAddLesson} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter votre première leçon
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Ordre</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...lessons].sort((a, b) => a.lesson_order - b.lesson_order).map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveLesson(lesson.id, 'up')}
                            disabled={lesson.lesson_order === Math.min(...lessons.map(l => l.lesson_order))}
                          >
                            ↑
                          </Button>
                          <span>{lesson.lesson_order}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7" 
                            onClick={() => handleMoveLesson(lesson.id, 'down')}
                            disabled={lesson.lesson_order === Math.max(...lessons.map(l => l.lesson_order))}
                          >
                            ↓
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{lesson.title}</TableCell>
                      <TableCell>{lesson.duration}</TableCell>
                      <TableCell>
                        <Badge variant={lesson.is_locked ? "secondary" : "default"}>
                          {lesson.is_locked ? "Verrouillé" : "Accessible"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleLock(lesson)}
                          >
                            {lesson.is_locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditLesson(lesson)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonManager;
