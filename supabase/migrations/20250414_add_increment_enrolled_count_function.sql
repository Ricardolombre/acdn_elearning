
-- Fonction pour incrémenter le nombre d'étudiants inscrits à un cours
CREATE OR REPLACE FUNCTION public.increment_enrolled_count(course_id INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.courses
  SET enrolled_count = enrolled_count + 1
  WHERE id = course_id;
END;
$$;

-- Ajout d'un index sur la colonne course_id de la table enrollments pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
