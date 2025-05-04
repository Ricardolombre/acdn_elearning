
import { useState, useEffect } from "react";
import ResourceCard, { ResourceType } from "./ResourceCard";
import { fetchAllResources } from "@/services/resourceService";
import { useToast } from "@/components/ui/use-toast";

const ResourceList = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const resourcesData = await fetchAllResources();
        setResources(resourcesData);
      } catch (error) {
        console.error("Erreur lors du chargement des ressources:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les ressources. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [toast]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <p>Chargement des ressources...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">Aucune ressource disponible</h3>
        <p className="text-gray-600">Des ressources seront ajoutées prochainement.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
