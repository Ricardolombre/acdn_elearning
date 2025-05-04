
import { supabase } from "@/integrations/supabase/client";
import { LessonType } from "@/data/lessons";

// Récupérer toutes les leçons d'un cours
export const fetchLessonsByCourseId = async (courseId: number): Promise<LessonType[]> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('lesson_order', { ascending: true });
  
  if (error) {
    console.error(`Erreur lors de la récupération des leçons du cours #${courseId}:`, error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return data.map(lesson => ({
    id: lesson.id,
    course_id: lesson.course_id,
    title: lesson.title,
    content: lesson.content,
    duration: lesson.duration,
    video_url: lesson.video_url || "",
    lesson_order: lesson.lesson_order,
    is_locked: lesson.is_locked || false
  })) as LessonType[];
};

// Récupérer une leçon spécifique
export const fetchLessonById = async (lessonId: number): Promise<LessonType | null> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {  // Code for "no rows returned"
      return null;
    }
    console.error(`Erreur lors de la récupération de la leçon #${lessonId}:`, error);
    throw error;
  }

  // Adapter le format de la BD au format attendu par l'application
  return {
    id: data.id,
    course_id: data.course_id,
    title: data.title,
    content: data.content,
    duration: data.duration,
    video_url: data.video_url || "",
    lesson_order: data.lesson_order,
    is_locked: data.is_locked || false
  };
};

// Récupérer la progression d'un utilisateur pour une leçon
export const fetchLessonProgress = async (lessonId: number, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('completed')
    .eq('lesson_id', lessonId)
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) {
    console.error(`Erreur lors de la récupération de la progression pour la leçon #${lessonId}:`, error);
    return false;
  }

  return data?.completed || false;
};

// Récupérer toutes les progressions de leçon pour un utilisateur dans un cours
export const fetchUserLessonProgressByCourse = async (courseId: number, userId: string): Promise<Record<number, boolean>> => {
  const { data: lessons, error: lessonError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId);
  
  if (lessonError) {
    console.error(`Erreur lors de la récupération des leçons pour le cours #${courseId}:`, lessonError);
    return {};
  }

  const lessonIds = lessons.map(lesson => lesson.id);
  
  const { data: progress, error: progressError } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds);

  if (progressError) {
    console.error(`Erreur lors de la récupération des progressions pour les leçons du cours #${courseId}:`, progressError);
    return {};
  }

  // Créer un objet avec les IDs des leçons comme clés et l'état de complétion comme valeurs
  const progressMap: Record<number, boolean> = {};
  progress.forEach(item => {
    progressMap[item.lesson_id] = item.completed;
  });

  return progressMap;
};

// Mettre à jour la progression d'une leçon
export const updateLessonProgress = async (lessonId: number, userId: string, completed: boolean): Promise<void> => {
  const { error } = await supabase
    .from('lesson_progress')
    .upsert({
      lesson_id: lessonId,
      user_id: userId,
      completed
    }, { onConflict: 'user_id,lesson_id' });
  
  if (error) {
    console.error(`Erreur lors de la mise à jour de la progression pour la leçon #${lessonId}:`, error);
    throw error;
  }
};

// Ajouter une nouvelle leçon
export const addLesson = async (lesson: LessonType): Promise<LessonType> => {

  const { data, error } = await supabase
  .from('lessons')
  .insert([{
    ...lesson,
    video_url: lesson.video_url || ''
  }])
  .select()
  .single();

  console.log("Ajout d'une leçon:", lesson);
  
  if (error) {
    console.error(`Erreur lors de l'ajout d'une leçon:`, error);
    throw error;
  }

  return {
    id: data.id,
    course_id: data.course_id,
    title: data.title,
    content: data.content,
    duration: data.duration,
    video_url: data.video_url || "",
    lesson_order: data.lesson_order,
    is_locked: data.is_locked || false
  };
};

// Mettre à jour une leçon existante
export const updateLesson = async (lesson: LessonType): Promise<LessonType> => {
  const { data, error } = await supabase
    .from('lessons')
    .update({
      course_id: lesson.course_id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      video_url: lesson.video_url,
      lesson_order: lesson.lesson_order,
      is_locked: lesson.is_locked
    })
    .eq('id', lesson.id)
    .select()
    .single();
  
  if (error) {
    console.error(`Erreur lors de la mise à jour de la leçon #${lesson.id}:`, error);
    throw error;
  }

  return {
    id: data.id,
    course_id: data.course_id,
    title: data.title,
    content: data.content,
    duration: data.duration,
    video_url: data.video_url || "",
    lesson_order: data.lesson_order,
    is_locked: data.is_locked || false
  };
};

// Supprimer une leçon
export const deleteLesson = async (lessonId: number): Promise<void> => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
  
  if (error) {
    console.error(`Erreur lors de la suppression de la leçon #${lessonId}:`, error);
    throw error;
  }
};

// Fonction pour inscrire un utilisateur à un cours
export const enrollUserInCourse = async (userId: string, courseId: number): Promise<void> => {
  // Première étape: vérifier si l'utilisateur est déjà inscrit
  const { data: existingEnrollment, error: checkError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  
  if (checkError) {
    console.error(`Erreur lors de la vérification de l'inscription au cours #${courseId}:`, checkError);
    throw checkError;
  }

  // Si l'utilisateur n'est pas déjà inscrit
  if (!existingEnrollment) {
    // Inscrire l'utilisateur au cours
    const { error: enrollError } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        completed: false,
        progress: 0
      });
    
    if (enrollError) {
      console.error(`Erreur lors de l'inscription au cours #${courseId}:`, enrollError);
      throw enrollError;
    }

    // Incrémenter le nombre d'étudiants inscrits dans la table des cours
    const { error: updateError } = await supabase
      .rpc('increment_enrolled_count', { course_id: courseId });
    
    if (updateError) {
      console.error(`Erreur lors de la mise à jour du nombre d'inscrits pour le cours #${courseId}:`, updateError);
      // Ne pas faire échouer l'opération si cette étape échoue
    }
  }
};

// Vérifier si un utilisateur est inscrit à un cours
export const checkUserEnrollment = async (userId: string, courseId: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  
  if (error) {
    console.error(`Erreur lors de la vérification de l'inscription au cours #${courseId}:`, error);
    return false;
  }
  
  return !!data;
};

// Récupérer tous les cours auxquels un utilisateur est inscrit
export const fetchUserEnrolledCourses = async (userId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Erreur lors de la récupération des cours de l'utilisateur:`, error);
    return [];
  }
  
  return data.map(item => item.course_id);
};
