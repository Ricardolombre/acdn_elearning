
import { useState, useEffect } from "react";
import CourseCard, { CourseType } from "./CourseCard";
import CourseFilter from "./CourseFilter";
import { fetchAllCourses } from "@/services/courseService";
import { useToast } from "@/components/ui/use-toast";

const CourseList = () => {
  const [allCourses, setAllCourses] = useState<CourseType[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    level: "",
    duration: ""
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await fetchAllCourses();
        setAllCourses(coursesData);
        setFilteredCourses(coursesData);
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

  const handleFilterChange = (newFilters: {
    search: string;
    category: string;
    level: string;
    duration: string;
  }) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    let result = allCourses;

    // Filter by search text
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (filters.category) {
      const categoryMap: { [key: string]: string } = {
        'fondamentaux': 'Fondamentaux',
        'conformite': 'Conformité',
        'securite': 'Sécurité',
        'propriete': 'Propriété Intellectuelle',
        'commerce': 'Commerce Électronique'
      };
      
      result = result.filter(
        course => course.category === categoryMap[filters.category]
      );
    }

    // Filter by level
    if (filters.level) {
      const levelMap: { [key: string]: string } = {
        'debutant': 'Débutant',
        'intermediaire': 'Intermédiaire',
        'avance': 'Avancé'
      };
      
      result = result.filter(
        course => course.level === levelMap[filters.level]
      );
    }

    // Filter by duration
    if (filters.duration) {
      const getDurationWeeks = (duration: string) => {
        const match = duration.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      result = result.filter(course => {
        const weeks = getDurationWeeks(course.duration);
        
        if (filters.duration === 'court') return weeks < 4;
        if (filters.duration === 'moyen') return weeks >= 4 && weeks <= 8;
        if (filters.duration === 'long') return weeks > 8;
        
        return true;
      });
    }

    setFilteredCourses(result);
  }, [filters, allCourses]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <p>Chargement des cours...</p>
      </div>
    );
  }

  return (
    <div>
      <CourseFilter onFilterChange={handleFilterChange} />
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Aucun cours ne correspond à vos critères</h3>
          <p className="text-gray-600">Veuillez modifier vos filtres pour voir plus de résultats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
