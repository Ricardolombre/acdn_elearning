
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface CourseType {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  enrolled_count: number;
}

interface CourseCardProps {
  course: CourseType;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Fondamentaux': 'bg-blue-100 text-blue-800 border-blue-200',
      'Conformité': 'bg-green-100 text-green-800 border-green-200',
      'Sécurité': 'bg-red-100 text-red-800 border-red-200',
      'Propriété Intellectuelle': 'bg-purple-100 text-purple-800 border-purple-200',
      'Commerce Électronique': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Débutant': 'bg-green-50 text-green-700 border-green-100',
      'Intermédiaire': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Avancé': 'bg-red-50 text-red-700 border-red-100',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="h-full flex flex-col card-hover">
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={getCategoryColor(course.category)}>
            {course.category}
          </Badge>
          <Badge variant="outline" className={getLevelColor(course.level)}>
            {course.level}
          </Badge>
        </div>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription>
          <span className="block">Par {course.instructor}</span>
          <span className="block">Durée: {course.duration}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{course.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="text-sm text-gray-500">
          {course.enrolled_count} inscrits
        </div>
        <Link to={`/cours/${course.id}`}>
          <Button className="btn-primary">Voir le cours</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
