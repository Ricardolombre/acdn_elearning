
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { fetchAllCourses } from "@/services/courseService";
import { CourseType } from "@/components/courses/CourseCard";

const CoursesHighlight = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await fetchAllCourses();
        // Prenons les 3 premiers cours comme cours mis en avant
        setFeaturedCourses(coursesData.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors du chargement des cours mis en avant:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <p>Chargement des cours...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Cours Populaires</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos formations les plus suivies, conçues pour vous permettre de 
            comprendre les enjeux juridiques du numérique au Congo.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-acdn-lightGreen/20 text-acdn-green border-acdn-lightGreen">
                    {course.category}
                  </Badge>
                  <Badge variant="outline">
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="mt-3">{course.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  Durée: {course.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{course.description}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/cours/${course.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Voir le détail</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/cours">
            <Button className="btn-primary">
              Voir tous les cours
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesHighlight;
