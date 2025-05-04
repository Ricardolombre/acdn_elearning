
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ResourceType } from "@/components/resources/ResourceCard";

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  type: z.enum(["Article", "Loi", "Étude de cas", "Guide", "Document"], {
    required_error: "Veuillez sélectionner un type de ressource",
  }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  date: z.string().min(1, { message: "La date est requise" }),
  download_url: z.string().optional(),
  external_url: z.string().optional(),
});

type ResourceFormValues = z.infer<typeof formSchema>;

interface ResourceFormProps {
  resource: ResourceType | null;
  onSave: (resource: ResourceType) => void;
  onCancel: () => void;
}

export function ResourceForm({ resource, onSave, onCancel }: ResourceFormProps) {
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: resource ? {
      ...resource,
    } : {
      title: "",
      description: "",
      type: "Document",
      category: "",
      date: new Date().toLocaleDateString('fr-FR'),
      download_url: "",
      external_url: ""
    }
  });

  const onSubmit = (values: ResourceFormValues) => {
    onSave({
      id: resource?.id || 0,
      title: values.title,
      description: values.description,
      type: values.type,
      category: values.category,
      date: values.date,
      download_url: values.download_url,
      external_url: values.external_url
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input placeholder="Titre de la ressource" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="Article">Article</option>
                    <option value="Loi">Loi</option>
                    <option value="Étude de cas">Étude de cas</option>
                    <option value="Guide">Guide</option>
                    <option value="Document">Document</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <Input placeholder="Catégorie" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input placeholder="JJ/MM/AAAA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="download_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL de téléchargement (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="external_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL externe (optionnel)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description détaillée de la ressource" 
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {resource ? "Mettre à jour" : "Créer"} la ressource
          </Button>
        </div>
      </form>
    </Form>
  );
}
