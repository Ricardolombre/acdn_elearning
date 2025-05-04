
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CourseType } from "@/components/courses/CourseCard";
import { fetchCourseById } from "@/services/courseService";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données du cours
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const courseId = parseInt(id);
          const courseData = await fetchCourseById(courseId);
          setCourse(courseData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du cours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [id]);

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

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">Chargement...</div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                  <div className="mb-6">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/cours")}
                      className="mb-4"
                    >
                      ← Retour aux cours
                    </Button>
                    <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {course?.category}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {course?.level}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {course?.duration}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">À propos de ce cours</h2>
                    <p className="text-gray-700">{course?.description}</p>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Instructeur</h2>
                    <p className="text-gray-700">{course?.instructor}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Contenu du cours</h2>
                    <p className="text-gray-600 mb-4">
                      Ce cours complet couvre tous les aspects essentiels du sujet.
                    </p>
                    <Button 
                      className="w-full md:w-auto"
                      onClick={() => navigate(`/cours/${id}/contenu`)}
                    >
                      Commencer l'apprentissage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CoursePage;
