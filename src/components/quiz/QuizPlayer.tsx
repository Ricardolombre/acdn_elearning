"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { QuizType, QuizResultType, QuizUserAnswerType, QuizQuestionType, QuizOptionType } from "@/data/quiz"
import {
  fetchQuizByLessonId,
  submitQuizAnswers,
  fetchQuizResultForUser,
  fetchOptionByQuestionId,
  fetchQuestionByQuizId,
} from "@/services/quizService"

// Ajouter cette interface au début du fichier, après les imports
interface ExtendedQuizUserAnswerType extends QuizUserAnswerType {
  _selectedOptionIds?: number[]
}

interface QuizPlayerProps {
  lessonId: number
  userId: string
  onComplete: (passed: boolean) => void
  onCancel: () => void
}

const QuizPlayer = ({ lessonId, userId, onComplete, onCancel }: QuizPlayerProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [quiz, setQuiz] = useState<QuizType | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<ExtendedQuizUserAnswerType[] | null>([])
  const [quizResult, setQuizResult] = useState<QuizResultType | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestionType[] | null>(null)
  const [options, setOptions] = useState<QuizOptionType[] | null>([])

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true)

        // Vérifier si l'utilisateur a déjà complété ce quiz
        const result = await fetchQuizResultForUser(lessonId, userId)
        if (result) {
          setQuizResult(result)
          setShowResults(true)
        }

        // Charger le quiz
        const quizData = await fetchQuizByLessonId(lessonId)
        if (!quizData) {
          toast({
            title: "Erreur",
            description: "Impossible de charger le quiz. Veuillez réessayer plus tard.",
            variant: "destructive",
          })
          onCancel()
          return
        }

        setQuiz(quizData)

        const questionData = await fetchQuestionByQuizId(quizData.id)
        setQuestions(questionData)

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

        setUserAnswers(
          questionData.map((question) => ({
            id: question.id,
            quiz_result_id: result?.id || 0,
            user_id: userId,
            question_id: question.id,
            selected_option_id: null,
            is_correct: false,
            _selectedOptionIds: [], // Initialiser avec un tableau vide
          })),
        )
      } catch (error) {
        console.error("Erreur lors du chargement du quiz:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger le quiz. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
        onCancel()
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [lessonId, userId, toast, onCancel])

  const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
    if (isMultiple) {
      // Pour les questions à choix multiple, nous devons créer plusieurs entrées
      // Ceci sera géré lors de la soumission
      setUserAnswers((prev) => {
        if (!prev) return prev
        return prev.map((answer) => {
          if (answer.question_id === questionId) {
            // Pour les choix multiples, nous stockons temporairement les sélections dans un champ non-DB
            const currentSelections = answer._selectedOptionIds || []
            if (currentSelections.includes(optionId)) {
              return {
                ...answer,
                _selectedOptionIds: currentSelections.filter((id) => id !== optionId),
                selected_option_id: currentSelections.filter((id) => id !== optionId)[0] || null,
              }
            } else {
              return {
                ...answer,
                _selectedOptionIds: [...currentSelections, optionId],
                selected_option_id: optionId, // On garde le dernier sélectionné comme valeur principale
              }
            }
          }
          return answer
        })
      })
    } else {
      // Pour les questions à choix unique, c'est simple
      setUserAnswers((prev) => {
        if (!prev) return prev
        return prev.map((answer) => {
          if (answer.question_id === questionId) {
            return {
              ...answer,
              selected_option_id: optionId,
              _selectedOptionIds: [optionId],
            }
          }
          return answer
        })
      })
    }
  }

  const handleNextQuestion = () => {
    if (!quiz || !questions) return

    // Vérifier si l'utilisateur a répondu à la question actuelle
    const currentAnswer = userAnswers?.[currentQuestionIndex]
    if (!currentAnswer || (!currentAnswer._selectedOptionIds?.length && !currentAnswer.selected_option_id)) {
      toast({
        title: "Réponse requise",
        description: "Veuillez sélectionner au moins une réponse avant de continuer.",
        variant: "destructive",
      })
      return
    }

    // Passer à la question suivante
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      // C'était la dernière question, soumettre le quiz
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !userAnswers) return

    // Vérifier que toutes les questions ont une réponse
    const unansweredQuestions = userAnswers.filter(
      (answer) => !answer.selected_option_id && !(answer._selectedOptionIds && answer._selectedOptionIds.length > 0),
    )

    if (unansweredQuestions.length > 0) {
      toast({
        title: "Réponses incomplètes",
        description: `Veuillez répondre à toutes les questions avant de soumettre le quiz.`,
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      // Formater les réponses pour l'API
      const formattedAnswers = []
      for (const answer of userAnswers) {
        if (answer._selectedOptionIds && answer._selectedOptionIds.length > 0) {
          // Pour les questions à choix multiple, créer une entrée pour chaque option sélectionnée
          for (const optionId of answer._selectedOptionIds) {
            formattedAnswers.push({
              question_id: answer.question_id,
              selected_option_id: optionId,
            })
          }
        } else if (answer.selected_option_id) {
          // Pour les questions à choix unique
          formattedAnswers.push({
            question_id: answer.question_id,
            selected_option_id: answer.selected_option_id,
          })
        }
      }

      // Soumettre les réponses
      const result = await submitQuizAnswers(quiz, userId, formattedAnswers)
      setQuizResult(result)
      setShowResults(true)

      // Notifier le composant parent
      onComplete(result.passed)
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz:", error)
      toast({
        title: "Erreur",
        description: "Impossible de soumettre vos réponses. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetakeQuiz = () => {
    setShowResults(false)
    setCurrentQuestionIndex(0)
    if (questions) {

      setUserAnswers(
        questions.map((question) => ({
          id: question.id,
          quiz_result_id: quizResult?.id || 0,
          user_id: userId,
          question_id: question.id,
          selected_option_id: null,
          is_correct: false,
          _selectedOptionIds: [], // Initialiser avec un tableau vide
        })),
      )
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>Impossible de charger le quiz. Veuillez réessayer plus tard.</AlertDescription>
      </Alert>
    )
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Résultats du quiz</CardTitle>
          <CardDescription>
            {quiz.title} - {quizResult?.score}% de réussite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Score: {quizResult?.score}%</span>
              <span>Score minimum requis: {quiz.passing_score}%</span>
            </div>
            <Progress value={quizResult?.score || 0} className="h-2" />
          </div>

          <Alert variant={quizResult?.passed ? "default" : "destructive"}>
            {quizResult?.passed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{quizResult?.passed ? "Félicitations!" : "Quiz non réussi"}</AlertTitle>
            <AlertDescription>
              {quizResult?.passed
                ? "Vous avez réussi ce quiz. Vous pouvez maintenant continuer votre apprentissage."
                : `Vous n'avez pas atteint le score minimum requis de ${quiz.passing_score}%. Vous pouvez réessayer le quiz.`}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Retour à la leçon
          </Button>
          {!quizResult?.passed && (
            <Button onClick={handleRetakeQuiz}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Réessayer le quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  const currentQuestion = questions?.[currentQuestionIndex]
  const isLastQuestion = questions ? currentQuestionIndex === questions.length - 1 : false
  const currentAnswer = userAnswers?.[currentQuestionIndex]
  const isMultipleChoice = currentQuestion?.question_type === "multiple_choice"
  const questionOptions = options?.filter((o) => o.question_id === currentQuestion?.id) || []

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{quiz.title}</CardTitle>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} sur {questions?.length || 0}
          </span>
        </div>
        {quiz.description && <CardDescription>{quiz.description}</CardDescription>}
        <Progress value={questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0} className="h-1 mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              {currentQuestion.question_text}
              <span className="text-sm text-gray-500 ml-2">
                ({currentQuestion.points} point{currentQuestion.points > 1 ? "s" : ""})
              </span>
            </h3>

            {isMultipleChoice ? (
              <div className="space-y-2">
                {questionOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={currentAnswer?._selectedOptionIds?.includes(option.id) || false}
                      onCheckedChange={(checked) => {
                        if (currentQuestion) {
                          handleOptionSelect(currentQuestion.id, option.id, true)
                        }
                      }}
                    />
                    <Label htmlFor={`option-${option.id}`}>{option.option_text}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={currentAnswer?.selected_option_id?.toString() || ""}
                onValueChange={(value) => {
                  if (currentQuestion) {
                    handleOptionSelect(currentQuestion.id, Number.parseInt(value), false)
                  }
                }}
              >
                {questionOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                    <Label htmlFor={`option-${option.id}`}>{option.option_text}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Précédent
        </Button>
        <Button onClick={handleNextQuestion} disabled={submitting}>
          {submitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <ArrowRight className="mr-2 h-4 w-4" />
          )}
          {isLastQuestion ? "Terminer" : "Suivant"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default QuizPlayer
