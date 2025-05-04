"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2, Save, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { QuizType, QuizQuestionType, QuizOptionType } from "@/data/quiz"
import {
  createQuiz,
  updateQuiz,
  fetchQuizByLessonId,
  deleteQuiz,
  createQuestion,
  fetchQuestionByQuizId,
  createOption,
  fetchOptionByQuestionId,
} from "@/services/quizService"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import QuestionComponent from "@/components/quiz/Question-component"
import QuestionPreview from "@/components/quiz/Question-preview"

interface QuizEditorProps {
  lessonId: number
  onSave: () => void
  onCancel: () => void
}

const QuizEditor = ({ lessonId, onSave, onCancel }: QuizEditorProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [existingQuiz, setExistingQuiz] = useState<QuizType | null>(null)

  const [quiz, setQuiz] = useState<QuizType>({
    id: 0,
    lesson_id: lessonId,
    title: "Autoévaluation",
    description: "Testez vos connaissances sur cette leçon",
    is_required: false,
    passing_score: 70,
  })

  const [questions, setQuestions] = useState<QuizQuestionType[]>([
    {
      id: 0,
      quiz_id: 0,
      question_text: "",
      question_type: "single_choice",
      points: 1,
      question_order: 1,
    },
  ])

  const [options, setOptions] = useState<QuizOptionType[]>([
    {
      id: 0,
      question_id: 0,
      option_text: "",
      is_correct: false,
      option_order: 1,
    },
  ])

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true)
        const quizData = await fetchQuizByLessonId(lessonId)

        if (quizData) {
          setExistingQuiz(quizData)
          setQuiz({
            id: quizData.id,
            lesson_id: quizData.lesson_id,
            title: quizData.title,
            description: quizData.description || "",
            is_required: quizData.is_required,
            passing_score: quizData.passing_score,
          })

          const questionData = await fetchQuestionByQuizId(quizData.id)
          setQuestions(questionData || [])

          const optionPromises = questionData.map((question) =>
            fetchOptionByQuestionId(question.id).then((options) =>
              options.map((option) => ({
                ...option,
                question_id: question.id,
              })),
            ),
          )

          const allOptions = await Promise.all(optionPromises)
          setOptions(allOptions.flat() || [])
        } else {
          // Ajouter une question par défaut si c'est un nouveau quiz
          setQuestions([
            {
              id: 0,
              quiz_id: quiz.id | 0,
              question_text: "",
              question_type: "single_choice",
              points: 1,
              question_order: 1,
            },
          ])

          setOptions([
            {
              id: 0,
              question_id: 0,
              option_text: "",
              is_correct: true, // Par défaut, la première option est correcte
              option_order: 1,
            },
            {
              id: 1,
              question_id: 0,
              option_text: "",
              is_correct: false,
              option_order: 2,
            },
          ])
        }
      } catch (error) {
        console.error("Erreur lors du chargement du quiz:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le quiz. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [lessonId, toast, quiz.id])

  // Assurons-nous que la fonction handleSaveQuiz filtre correctement les options par question
  const handleSaveQuiz = async () => {
    try {
      setSaving(true)

      if (questions.length === 0) {
        toast({
          title: "Erreur",
          description: "Le quiz doit contenir au moins une question.",
          variant: "destructive",
        })
        return
      }

      // Vérifier que chaque question a au moins une option correcte
      for (const question of questions) {
        const questionOptions = options.filter((o) => o.question_id === question.id)

        if (questionOptions.length === 0) {
          toast({
            title: "Erreur",
            description: `La question "${question.question_text}" n'a pas d'options de réponse.`,
            variant: "destructive",
          })
          return
        }

        const hasCorrectOption = questionOptions.some((option) => option.is_correct)

        if (!hasCorrectOption) {
          toast({
            title: "Erreur",
            description: `La question "${question.question_text}" doit avoir au moins une réponse correcte.`,
            variant: "destructive",
          })
          return
        }

        if (question.question_type === "single_choice") {
          const correctOptions = questionOptions.filter((option) => option.is_correct)
          if (correctOptions.length > 1) {
            toast({
              title: "Erreur",
              description: `La question à choix unique "${question.question_text}" ne peut avoir qu'une seule réponse correcte.`,
              variant: "destructive",
            })
            return
          }
        }
      }

      let quizId = existingQuiz?.id

      if (existingQuiz) {
        await updateQuiz({
          ...quiz,
          id: existingQuiz.id,
        })
      } else {
        const createdQuiz = await createQuiz(quiz)
        if (!createdQuiz) throw new Error("Failed to create quiz")
        quizId = createdQuiz.id
      }

      // Enregistrement des questions
      for (const question of questions) {
        const createdQuestion = await createQuestion({
          id: question.id,
          quiz_id: quizId,
          question_text: question.question_text,
          question_type: question.question_type,
          points: question.points,
          question_order: question.question_order,
        })
        if (!createdQuestion) throw new Error("Failed to create question")

        // Enregistrement des options pour chaque question
        const questionOptions = options.filter((o) => o.question_id === question.id)
        for (const option of questionOptions) {
          const createdOption = await createOption({
            id: option.id,
            question_id: createdQuestion.id,
            option_text: option.option_text,
            is_correct: option.is_correct,
            option_order: option.option_order,
          })
          if (!createdOption) throw new Error("Failed to create option")
        }
      }

      toast({
        title: existingQuiz ? "Quiz mis à jour" : "Quiz créé",
        description: "Tout a été enregistré avec succès.",
      })

      onSave()
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du quiz:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le quiz. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteQuiz = async () => {
    if (!existingQuiz) return

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.")) {
      return
    }

    try {
      setSaving(true)
      await deleteQuiz(existingQuiz.id)
      toast({
        title: "Quiz supprimé",
        description: "Le quiz a été supprimé avec succès.",
      })
      onSave()
    } catch (error) {
      console.error("Erreur lors de la suppression du quiz:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le quiz. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Remplacer par cette nouvelle implémentation qui crée des options par défaut pour chaque nouvelle question
  const handleAddQuestion = () => {
    const newQuestionId = Math.max(0, ...questions.map((q) => q.id)) + 1
    const newQuestion: QuizQuestionType = {
      id: newQuestionId,
      quiz_id: quiz.id,
      question_text: "",
      question_type: "single_choice",
      points: 1,
      question_order: questions.length + 1,
    }

    // Créer deux options par défaut pour la nouvelle question
    const newOptions = [
      {
        id: Math.max(0, ...options.map((o) => o.id)) + 1,
        question_id: newQuestionId,
        option_text: "",
        is_correct: true, // Par défaut, la première option est correcte
        option_order: 1,
      },
      {
        id: Math.max(0, ...options.map((o) => o.id)) + 2,
        question_id: newQuestionId,
        option_text: "",
        is_correct: false,
        option_order: 2,
      },
    ]

    setQuestions((prev) => [...prev, newQuestion])
    setOptions((prev) => [...prev, ...newOptions])
  }

  const handleDeleteQuestion = (questionId: number) => {
    if (questions.length <= 1) {
      toast({
        title: "Erreur",
        description: "Vous devez avoir au moins une question.",
        variant: "destructive",
      })
      return
    }

    setOptions((prev) => prev.filter((option) => option.question_id !== questionId))
    setQuestions((prev) => prev.filter((question) => question.id !== questionId))
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const { source, destination, type } = result

    if (type === "question") {
      const reorderedQuestions = Array.from(questions)
      const [removed] = reorderedQuestions.splice(source.index, 1)
      reorderedQuestions.splice(destination.index, 0, removed)

      // Update question_order for all questions
      const updatedQuestions = reorderedQuestions.map((q, index) => ({
        ...q,
        question_order: index + 1,
      }))

      setQuestions(updatedQuestions)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Éditeur de quiz</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          {existingQuiz && (
            <Button variant="destructive" onClick={handleDeleteQuiz} disabled={saving}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
          <Button onClick={handleSaveQuiz} disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du quiz</Label>
                <Input
                  id="title"
                  value={quiz.title}
                  onChange={(e) => setQuiz((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre du quiz"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={quiz.description || ""}
                  onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du quiz"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isRequired">Quiz obligatoire</Label>
                  <p className="text-sm text-muted-foreground">
                    L'étudiant doit compléter ce quiz pour terminer la leçon
                  </p>
                </div>
                <Switch
                  id="isRequired"
                  checked={quiz.is_required}
                  onCheckedChange={(checked) => setQuiz((prev) => ({ ...prev, is_required: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="passingScore">Score de réussite: {quiz.passing_score}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {quiz.passing_score < 60 ? "Facile" : quiz.passing_score < 80 ? "Moyen" : "Difficile"}
                  </span>
                </div>
                <Slider
                  id="passingScore"
                  min={50}
                  max={100}
                  step={5}
                  value={[quiz.passing_score]}
                  onValueChange={(value) => setQuiz((prev) => ({ ...prev, passing_score: value[0] }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions" type="question">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                  {questions.map((question, questionIndex) => (
                    <Draggable
                      key={`question-${question.id}`}
                      draggableId={`question-${question.id}`}
                      index={questionIndex}
                    >
                      {(provided) => (
                        <QuestionComponent
                          key={question.id}
                          question={question}
                          questionOptions={options.filter((o) => o.question_id === question.id)}
                          onQuestionChange={(field, value) => {
                            setQuestions((prev) =>
                              prev.map((q) => (q.id === question.id ? { ...q, [field]: value } : q)),
                            )
                          }}
                          onOptionChange={(optionId, field, value) => {
                            setOptions((prev) =>
                              prev.map((o) =>
                                o.question_id === question.id && o.id === optionId ? { ...o, [field]: value } : o,
                              ),
                            )
                          }}
                          onAddOption={() => {
                            const newOption = {
                              id: Math.max(0, ...options.map((o) => o.id)) + 1,
                              question_id: question.id,
                              option_text: "",
                              is_correct: false,
                              option_order: options.filter((o) => o.question_id === question.id).length + 1,
                            }
                            setOptions((prev) => [...prev, newOption])
                          }}
                          onDeleteOption={(optionId) => {
                            const questionOptions = options.filter((o) => o.question_id === question.id)
                            if (questionOptions.length <= 2) {
                              toast({
                                title: "Erreur",
                                description: "Vous devez avoir au moins deux options.",
                                variant: "destructive",
                              })
                              return
                            }
                            setOptions((prev) =>
                              prev.filter((o) => !(o.question_id === question.id && o.id === optionId)),
                            )
                          }}
                          onDeleteQuestion={() => handleDeleteQuestion(question.id)}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          forwardedRef={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button onClick={handleAddQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une question
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              {quiz.description && <p className="text-gray-600 mt-2">{quiz.description}</p>}
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.length > 0 ? (
                questions.map((question, questionIndex) => (
                  <QuestionPreview
                    key={question.id}
                    question={question}
                    questionIndex={questionIndex}
                    options={options.filter((o) => o.question_id === question.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="h-12 w-12 mx-auto mb-2" />
                  <p>Aucune question n'a été ajoutée à ce quiz.</p>
                  <p>Allez dans l'onglet "Questions" pour en ajouter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default QuizEditor
