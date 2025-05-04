"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { LessonType } from "@/data/lessons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Clock, List, Link, Lock, BookOpen } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Importer les composants
import RichTextEditor from "./RichTextEditor"
import QuizEditor from "./QuizEditor"

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  content: z.string().min(10, { message: "Le contenu doit contenir au moins 10 caractères" }),
  duration: z.string().min(1, { message: "La durée est requise" }),
  video_url: z.string().optional(),
  lesson_order: z.number().int().min(1),
  is_locked: z.boolean(),
  hasQuiz: z.boolean().default(false),
})

type LessonFormValues = z.infer<typeof formSchema>

interface LessonFormProps {
  lesson: Partial<LessonType> | null
  courseId: number
  onSave: (lesson: LessonType) => void
  onCancel: () => void
}

export function LessonForm({ lesson, courseId, onSave, onCancel }: LessonFormProps) {
  const [activeTab, setActiveTab] = useState("content")
  const [showQuizEditor, setShowQuizEditor] = useState(false)

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: lesson
      ? {
          ...lesson,
          hasQuiz: false, // À remplacer par la vérification réelle de l'existence d'un quiz
        }
      : {
          title: "",
          content: "",
          duration: "",
          video_url: "",
          lesson_order: 1,
          is_locked: false,
          hasQuiz: false,
        },
  })

  const onSubmit = (values: LessonFormValues) => {
    // Ensure all required fields are present
    const completeLesson: LessonType = {
      id: lesson?.id || Math.floor(Math.random() * 10000),
      course_id: courseId,
      title: values.title,
      content: values.content,
      duration: values.duration,
      video_url: values.video_url || "",
      lesson_order: values.lesson_order,
      is_locked: values.is_locked,
    }

    onSave(completeLesson)
  }

  const handleQuizSaved = () => {
    setShowQuizEditor(false)
    form.setValue("hasQuiz", true)
  }

  return (
    <Card className="border-t-4 border-t-acdn-blue">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2 text-acdn-blue">
          <FileText className="h-5 w-5" />
          {lesson?.id ? "Modifier la leçon" : "Nouvelle leçon"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {showQuizEditor ? (
          <QuizEditor lessonId={lesson?.id || 0} onSave={handleQuizSaved} onCancel={() => setShowQuizEditor(false)} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="content">Contenu</TabsTrigger>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Titre
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Titre de la leçon" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Durée
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="ex: 45 min" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Contenu
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Contenu détaillé de la leçon"
                            className="min-h-[400px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="video_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Link className="h-4 w-4" />
                            URL de la vidéo (optionnel)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/video" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lesson_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <List className="h-4 w-4" />
                            Ordre
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="is_locked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Verrouillé
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Cette leçon nécessite un accès spécial pour être consultée
                          </div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="quiz" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="hasQuiz"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-gray-50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Quiz d'autoévaluation
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Ajouter un quiz à la fin de cette leçon pour tester les connaissances des étudiants
                          </div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("hasQuiz") && (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50">
                      <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Quiz d'autoévaluation</h3>
                      <p className="text-gray-500 text-center mb-4">
                        {lesson?.id
                          ? "Un quiz est associé à cette leçon. Vous pouvez le modifier ou en créer un nouveau."
                          : "Vous pourrez créer un quiz après avoir enregistré cette leçon."}
                      </p>
                      <Button onClick={() => setShowQuizEditor(true)} disabled={!lesson?.id}>
                        {lesson?.id ? "Gérer le quiz" : "Enregistrez d'abord la leçon"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <AlertDescription>
                  Les leçons sont présentées aux étudiants selon l'ordre que vous définissez. Assurez-vous que le
                  contenu est clair et bien structuré.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-4 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-acdn-blue hover:bg-acdn-blue/90">
                  {lesson?.id ? "Mettre à jour" : "Créer"} la leçon
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
