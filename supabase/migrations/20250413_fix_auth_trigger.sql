
-- Vérifier si le trigger existe déjà et le supprimer si c'est le cas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer ou remplacer la fonction qui gère la création de nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'Étudiant');
  RETURN NEW;
END;
$$;

-- Créer le trigger pour exécuter la fonction à chaque création d'utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
