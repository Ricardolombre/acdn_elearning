
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourseType } from "@/components/courses/CourseCard";
import { CourseForm } from "./CourseForm";
import LessonManager from "./LessonManager";
import { useToast } from "@/hooks/use-toast";
import { fetchAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";

const AdminCourses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseType | null>(null);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
    setSelectedCourseForLessons(null);
  };

  const handleEditCourse = (course: CourseType) => {
    setEditingCourse(course);
    setShowForm(true);
    setSelectedCourseForLessons(null);
  };

  const handleDeleteCourse = (courseId: number) => {
    deleteCourse(courseId);
    setCourses(courses.filter(course => course.id !== courseId));
    toast({
      title: "Cours supprimé",
      description: "Le cours a été supprimé avec succès.",
    });
    if (selectedCourseForLessons?.id === courseId) {
      setSelectedCourseForLessons(null);
    }
  };

  const handleSaveCourse = (course: CourseType) => {
    if (editingCourse) {
      // Mise à jour d'un cours existant
      updateCourse(course);
      setCourses(courses.map(c => c.id === course.id ? course : c));
      toast({
        title: "Cours mis à jour",
        description: "Le cours a été mis à jour avec succès.",
      });
    } else {
      // Ajout d'un nouveau cours
      const newCourse = { ...course, id: courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1 };
      createCourse(newCourse)
      setCourses([...courses, newCourse]);
      toast({
        title: "Cours ajouté",
        description: "Le nouveau cours a été ajouté avec succès.",
      });
    }
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleManageLessons = (course: CourseType) => {
    setSelectedCourseForLessons(course);
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleBackToCourses = () => {
    setSelectedCourseForLessons(null);
  };

  useEffect(() => {
      const loadCourses = async () => {
        try {
          setLoading(true);
          const coursesData = await fetchAllCourses();
          setCourses(coursesData);
        } catch (error) {
          console.error("Erreur lors du chargement des cours:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les cours. Veuillez réessayer plus tard.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
  
      loadCourses();
    }, [toast]);

  return (
    <Card>
      {selectedCourseForLessons ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Button variant="outline" onClick={handleBackToCourses} className="mb-2">
                ← Retour aux cours
              </Button>
              <CardTitle>Leçons: {selectedCourseForLessons.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <LessonManager courseId={selectedCourseForLessons.id} />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gestion des cours</CardTitle>
            <Button onClick={handleAddCourse}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un cours
            </Button>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <CourseForm 
                course={editingCourse} 
                onSave={handleSaveCourse} 
                onCancel={handleCancelForm} 
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Instructeur</TableHead>
                    <TableHead>Inscrits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.id}</TableCell>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.enrolled_count}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleManageLessons(course)}>
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default AdminCourses;
