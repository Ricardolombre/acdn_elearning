
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResourceForm } from "./ResourceForm";
import { useToast } from "@/hooks/use-toast";
import { ResourceType } from "@/components/resources/ResourceCard";
import { fetchAllResources, updateResources, addResources, deleteResources } from "@/services/resourceService";


const AdminResources = () => {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAddResource = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleEditResource = (resource: ResourceType) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDeleteResource = (resourceId: number) => {
    deleteResources(resourceId);
    setResources(resources.filter(resource => resource.id !== resourceId));
    toast({
      title: "Ressource supprimée",
      description: "La ressource a été supprimée avec succès.",
    });
  };

  const handleSaveResource = (resource: ResourceType) => {
    if (editingResource) {
      // Mise à jour d'une ressource existante
      updateResources(editingResource);
      setResources(resources.map(r => r.id === resource.id ? resource : r));
      toast({
        title: "Ressource mise à jour",
        description: "La ressource a été mise à jour avec succès.",
      });
    } else {
      // Ajout d'une nouvelle ressource
      const newResource = { ...resource, id: resources.length ? Math.max(...resources.map(r => r.id)) + 1 : 1 };
      addResources(newResource)
      setResources([...resources, newResource]);
      toast({
        title: "Ressource ajoutée",
        description: "La nouvelle ressource a été ajoutée avec succès.",
      });
    }
    setShowForm(false);
    setEditingResource(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

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
  }, [toast])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des ressources</CardTitle>
        <Button onClick={handleAddResource}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ressource
        </Button>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <ResourceForm
            resource={editingResource}
            onSave={handleSaveResource}
            onCancel={handleCancelForm}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.id}</TableCell>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.type}</Badge>
                  </TableCell>
                  <TableCell>{resource.category}</TableCell>
                  <TableCell>{resource.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditResource(resource)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteResource(resource.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminResources;
