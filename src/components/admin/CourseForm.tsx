
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CourseType } from "@/components/courses/CourseCard";

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères" }),
  category: z.string().min(1, { message: "La catégorie est requise" }),
  level: z.string().min(1, { message: "Le niveau est requis" }),
  duration: z.string().min(1, { message: "La durée est requise" }),
  instructor: z.string().min(1, { message: "L'instructeur est requis" }),
  enrolled_count: z.number().int().min(0)
});

type CourseFormValues = z.infer<typeof formSchema>;

interface CourseFormProps {
  course: CourseType | null;
  onSave: (course: CourseType) => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: course ? {
      ...course,
    } : {
      title: "",
      description: "",
      category: "",
      level: "",
      duration: "",
      instructor: "",
      enrolled_count: 0
    }
  });

  const onSubmit = (values: CourseFormValues) => {
    onSave({
      id: course?.id || 0,
      title: values.title,
      description: values.description,
      category: values.category,
      level: values.level,
      duration: values.duration,
      instructor: values.instructor,
      enrolled_count: values.enrolled_count
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
                  <Input placeholder="Titre du cours" {...field} />
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
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Niveau</FormLabel>
                <FormControl>
                  <Input placeholder="Débutant, Intermédiaire, Avancé" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 6 semaines" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructeur</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'instructeur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="enrolled_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre d'inscrits</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
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
                  placeholder="Description détaillée du cours" 
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
            {course ? "Mettre à jour" : "Créer"} le cours
          </Button>
        </div>
      </form>
    </Form>
  );
}
