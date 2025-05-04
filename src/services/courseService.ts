
import { supabase } from "@/integrations/supabase/client";
import { CourseType } from "@/components/courses/CourseCard";

export const fetchAllCourses = async (): Promise<CourseType[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('id');
  
  if (error) {
    console.error("Erreur lors de la récupération des cours:", error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return data.map(course => ({
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    level: course.level,
    duration: course.duration,
    instructor: course.instructor,
    enrolled_count: course.enrolled_count || 0
  })) as CourseType[];
};

export const fetchCourseById = async (id: number): Promise<CourseType | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {  // Code for "no rows returned"
      return null;
    }
    console.error(`Erreur lors de la récupération du cours #${id}:`, error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    duration: data.duration,
    instructor: data.instructor,
    enrolled_count: data.enrolled_count || 0
  };
};

export const createCourse = async (course: CourseType): Promise<CourseType> => {
  const { data, error } = await supabase
    .from('courses')
    .insert([course])
    .select()
    .single();
  
  if (error) {
    console.error("Erreur lors de la création du cours:", error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    duration: data.duration,
    instructor: data.instructor,
    enrolled_count: data.enrolled_count || 0
  };
}

export const updateCourse = async (course: CourseType): Promise<CourseType> => {
  const { data, error } = await supabase
    .from('courses')
    .update(course)
    .eq('id', course.id)
    .select()
    .single();
  
  if (error) {
    console.error("Erreur lors de la mise à jour du cours:", error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    duration: data.duration,
    instructor: data.instructor,
    enrolled_count: data.enrolled_count || 0
  };
};

export const deleteCourse = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Erreur lors de la suppression du cours #${id}:`, error);
    throw error;
  }
};