import { supabase } from "@/integrations/supabase/client";
import { ResourceType } from "@/components/resources/ResourceCard";

export const fetchAllResources = async (): Promise<ResourceType[]> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('id');
  
  if (error) {
    console.error("Erreur lors de la récupération des ressources:", error);
    throw error;
  }

  return data as ResourceType[];
};

export const fetchResourcesByType = async (type: string): Promise<ResourceType[]> => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('type', type)
    .order('id');
  
  if (error) {
    console.error(`Erreur lors de la récupération des ressources de type ${type}:`, error);
    throw error;
  }

  return data as ResourceType[];
};

export const updateResources = async (resource: ResourceType): Promise<ResourceType> => {
  const { error: resourceError } = await supabase
    .from("resources")
    .update({
      category: resource.category,
      description: resource.description,
      download_url: resource.download_url,
      external_url: resource.external_url,
      title: resource.title,
      type: resource.type,
      date: resource.date,
      updated_at: new Date().toISOString()
    })
    .eq("id", resource.id);

  if (resourceError) {
    console.error(`Erreur lors de la mise à jour de la ressource #${resource.id}:`, resourceError);
    throw resourceError;
  }

  return resource;
}

export const addResources = async (resource: ResourceType): Promise<ResourceType> => {
  const { error: resourceError } = await supabase
    .from("resources")
    .insert({
      category: resource.category,
      description: resource.description,
      download_url: resource.download_url,
      external_url: resource.external_url,
      title: resource.title,
      type: resource.type,
      date: resource.date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (resourceError) {
    console.error(`Erreur lors de l'ajout de la ressource #${resource.id}:`, resourceError);
    throw resourceError;
  }

  return resource;
}

export const deleteResources = async (resourceId: number): Promise<void> => {
  const { error: resourceError } = await supabase
    .from("resources")
    .delete()
    .eq("id", resourceId);

  if (resourceError) {
    console.error(`Erreur lors de la suppression de la ressource #${resourceId}:`, resourceError);
    throw resourceError;
  }
}