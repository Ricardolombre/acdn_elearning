
-- Créer un bucket pour les avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'Avatars des utilisateurs', true);

-- Permettre à tous les utilisateurs authentifiés d'ajouter un avatar
CREATE POLICY "Les utilisateurs authentifiés peuvent télécharger leur avatar" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre aux utilisateurs authentifiés de mettre à jour leur avatar
CREATE POLICY "Les utilisateurs authentifiés peuvent mettre à jour leur avatar" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre aux utilisateurs authentifiés de supprimer leur avatar
CREATE POLICY "Les utilisateurs authentifiés peuvent supprimer leur avatar" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Permettre à tous d'accéder aux avatars (lecture publique)
CREATE POLICY "Les avatars sont publiquement accessibles" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'avatars');
