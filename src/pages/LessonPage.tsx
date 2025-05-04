"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react"
import type { LessonType } from "@/data/lessons"
import {
  fetchLessonById,
  fetchLessonsByCourseId,
  updateLessonProgress,
  enrollUserInCourse,
} from "@/services/lessonService"
import { fetchQuizByLessonId, fetchQuizResultByLessonId } from "@/services/quizService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import QuizPlayer from "@/components/quiz/QuizPlayer"

const LessonPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, userData } = useAuth()
  const { toast } = useToast()

  const [lesson, setLesson] = useState<LessonType | null>(null)
  const [nextLesson, setNextLesson] = useState<LessonType | null>(null)
  const [prevLesson, setPrevLesson] = useState<LessonType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompletingLesson, setIsCompletingLesson] = useState(false)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } })
      return
    }

    const loadLesson = async () => {
      try {
        setIsLoading(true)

        // Récupérer la leçon courante et les leçons adjacentes
        const courseIdNum = Number.parseInt(courseId || "0")
        const lessonIdNum = Number.parseInt(lessonId || "0")

        const currentLesson = await fetchLessonById(lessonIdNum)
        if (!currentLesson) {
          setLesson(null)
          setIsLoading(false)
          return
        }

        setLesson(currentLesson)

        // Vérifier si la leçon a un quiz
        const quiz = await fetchQuizByLessonId(lessonIdNum)
        setHasQuiz(!!quiz)

        // Récupérer toutes les leçons du cours pour trouver les leçons précédentes et suivantes
        const courseLessons = await fetchLessonsByCourseId(courseIdNum)
        const orderedLessons = [...courseLessons].sort((a, b) => a.lesson_order - b.lesson_order)
        const currentIndex = orderedLessons.findIndex((l) => l.id === lessonIdNum)

        if (currentIndex > 0) {
          setPrevLesson(orderedLessons[currentIndex - 1])
        } else {
          setPrevLesson(null)
        }

        if (currentIndex < orderedLessons.length - 1) {
          setNextLesson(orderedLessons[currentIndex + 1])
        } else {
          setNextLesson(null)
        }

        // Inscrire automatiquement l'utilisateur au cours s'il est authentifié
        if (userData?.id) {
          try {
            await enrollUserInCourse(userData.id, courseIdNum)
          } catch (error) {
            console.error("Erreur lors de l'inscription au cours:", error)
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la leçon:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la leçon. Veuillez réessayer plus tard.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadLesson()
  }, [courseId, lessonId, isAuthenticated, navigate, toast, userData?.id])

  const handleCompleteLessonAndContinue = async () => {
    if (!userData?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour marquer une leçon comme terminée.",
        variant: "destructive",
      })
      return
    }

    const result = await fetchQuizResultByLessonId(lesson.id, userData.id)

    if (result.passed) {
      toast({
        title: "Quiz déjà réussi",
        description: `Vous avez déjà réussi ce quiz avec un score de ${ result.score }%.`,
        variant: "destructive",
      })
      return
    }

    // Si la leçon a un quiz, l'afficher au lieu de marquer la leçon comme terminée
    if (hasQuiz && !showQuiz) {
      setShowQuiz(true)
      return
    }

    try {
      setIsCompletingLesson(true)

      // Marquer la leçon comme terminée
      if (lesson) {
        await updateLessonProgress(lesson.id, userData.id, true)
      }

      toast({
        title: "Quiz réussi",
        description: "Vous avez réussi le quiz ! La leçon est maintenant marquée comme terminée."
      })

      // Naviguer vers la prochaine leçon ou revenir à la liste des leçons
      if (nextLesson && !nextLesson.is_locked) {
        navigate(`/cours/${courseId}/lecon/${nextLesson.id}`)
      } else {
        navigate(`/cours/${courseId}/contenu`)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre progression. Veuillez réessayer plus tard.",
        variant: "destructive",
      })
    } finally {
      setIsCompletingLesson(false)
    }
  }

  const handleQuizComplete = async (passed: boolean) => {
    if (passed) {
      // Si l'utilisateur a réussi le quiz, marquer la leçon comme terminée
      await handleCompleteLessonAndContinue()
    } else {
      // Sinon, laisser l'utilisateur réessayer le quiz
      setShowQuiz(true)
    }
  }

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url; // sinon, on laisse tel quel
  }  

  // Si la leçon n'est pas trouvée
  if (!isLoading && !lesson) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertTitle>Leçon non trouvée</AlertTitle>
            <AlertDescription>La leçon que vous recherchez n'existe pas.</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => navigate(`/cours/${courseId}/contenu`)}>Retour au contenu du cours</Button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-6 md:py-12 min-h-screen">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
              <p>Chargement de la leçon...</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => navigate(`/cours/${courseId}/contenu`)} className="gap-1">
                  <ChevronLeft className="h-4 w-4" /> Contenu du cours
                </Button>

                <div className="flex gap-2">
                  {prevLesson && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/cours/${courseId}/lecon/${prevLesson.id}`)}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Précédent
                    </Button>
                  )}

                  {nextLesson && !nextLesson.is_locked && (
                    <Button onClick={() => navigate(`/cours/${courseId}/lecon/${nextLesson.id}`)} className="gap-1">
                      Suivant <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {showQuiz && userData?.id ? (
                <QuizPlayer
                  lessonId={Number.parseInt(lessonId || "0")}
                  userId={userData.id}
                  onComplete={handleQuizComplete}
                  onCancel={() => setShowQuiz(false)}
                />
              ) : (
                <Card className="mb-8">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Leçon {lesson?.lesson_order} • {lesson?.duration}
                        </div>
                        <CardTitle className="text-2xl">{lesson?.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="prose prose-blue max-w-none">
                    {lesson?.video_url ? (
                      <div className="relative overflow-hidden rounded-md mb-6" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={getEmbedUrl(lesson.video_url + "?disablePictureInPicture=1")}
                          className="absolute top-0 left-0 w-full h-full"
                          title="Vidéo YouTube"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="aspect-w-16 aspect-h-9 mb-6 bg-gray-100 flex items-center justify-center rounded-md">
                        <div className="text-center p-8">
                          <Play className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                          <p className="text-gray-500">Vidéo non disponible</p>
                        </div>
                      </div>
                    )}

                    <h2>Contenu de la leçon</h2>
                    <div
                      className="prose prose-blue max-w-none"
                      dangerouslySetInnerHTML={{ __html: lesson?.content || "" }}
                    />
                  </CardContent>
                </Card>
              )}

              {!showQuiz && (
                <div className="flex justify-between items-center mb-8">
                  <Button variant="outline" onClick={() => navigate(`/cours/${courseId}/contenu`)} className="gap-1">
                    <ChevronLeft className="h-4 w-4" /> Retour au contenu
                  </Button>

                  <Button onClick={handleCompleteLessonAndContinue} className="gap-2" disabled={isCompletingLesson}>
                    {isCompletingLesson ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {hasQuiz && !showQuiz
                      ? "Commencer le quiz"
                      : nextLesson && !nextLesson.is_locked
                        ? "Terminer et continuer"
                        : "Marquer comme terminé"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default LessonPage
