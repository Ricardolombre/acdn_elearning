import { supabase } from "@/integrations/supabase/client"
import type { QuizType, QuizQuestionType, QuizOptionType, QuizResultType } from "@/data/quiz"

// Récupérer un quiz par ID de leçon
export const fetchQuizByLessonId = async (lessonId: number): Promise<QuizType | null> => {
  // Récupérer le quiz
  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single()

  if (quizError) {
    if (quizError.code === "PGRST116") {
      // Code for "no rows returned"
      return null
    }
    console.error(`Erreur lors de la récupération du quiz pour la leçon #${lessonId}:`, quizError)
    throw quizError
  }

  if (quizData.id === null) {
    console.error(`Erreur: le quiz n'a pas été trouvé pour la leçon #${lessonId}`)
    return null
  }

  // Construire et retourner l'objet quiz complet
  return {
    id: quizData.id,
    lesson_id: quizData.lesson_id,
    title: quizData.title,
    description: quizData.description,
    is_required: quizData.is_required,
    passing_score: quizData.passing_score,
  }
}

export const fetchQuestionByQuizId = async (quizId: number): Promise<QuizQuestionType[]> => {
  // Récupérer les questions du quiz
  const { data: questionsData, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('question_order', { ascending: true })

  if (questionsError) {
    console.error(`Erreur lors de la récupération des questions du quiz #${quizId}:`, questionsError)
    throw questionsError
  }

  const questions: QuizQuestionType[] = []

  // Pour chaque question, récupérer les options
  for (const question of questionsData) {
    const { data: optionsData, error: optionsError } = await supabase
      .from("quiz_options")
      .select("*")
      .eq("question_id", question.id)
      .order("option_order", { ascending: true })

    if (optionsError) {
      console.error(`Erreur lors de la récupération des options pour la question #${question.id}:`, optionsError)
      throw optionsError
    }

    questions.push({
      id: question.id,
      quiz_id: question.quiz_id,
      question_text: question.question_text,
      question_type: question.question_type as "multiple_choice" | "true_false" | "single_choice",
      points: question.points,
      question_order: question.question_order,
    })
  }

  return questions
}

export const fetchQuizResultByLessonId = async (lessonId: number, userId: string): Promise<QuizResultType | null> => {
  const quiz = await fetchQuizByLessonId(lessonId)

  const { data: quizResult, error: quizResultError } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("quiz_id", quiz?.id)
    .eq("user_id", userId)
    .select()
    .single()

  if (quizResultError) {
    console.error(`Erreur lors de la récupération du résultat du quiz pour la leçon #${lessonId}:`, quizResultError)
    throw quizResultError
  }

  if (!quizResult) return null
  return {
    id: quizResult.id,
    quiz_id: quizResult.quiz_id,
    user_id: quizResult.user_id,
    score: quizResult.score,
    passed: quizResult.passed,
    completed_at: quizResult.completed_at,
  }
}

export const fetchOptionByQuestionId = async (questionId: number): Promise<QuizOptionType[]> => {
  // Récupérer les options de la question
  const { data: optionsData, error: optionsError } = await supabase
    .from('quiz_options')
    .select('*')
    .eq('question_id', questionId)
    .order('option_order', { ascending: true })

  if (optionsError) {
    console.error(`Erreur lors de la récupération des options pour la question #${questionId}:`, optionsError)
    throw optionsError
  }

  return optionsData as QuizOptionType[]
}

// Créer un nouveau quiz
export const createQuiz = async (quiz: QuizType): Promise<QuizType | null> => {
  // Insérer le quiz
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .insert({
      lesson_id: quiz.lesson_id,
      title: quiz.title,
      description: quiz.description,
      is_required: quiz.is_required,
      passing_score: quiz.passing_score,
    })
    .select()
    .single()

  console.log("Quiz data:", quiz)

  if (quizError) {
    console.error("Erreur lors de la création du quiz:", quizError)
    throw quizError
  }

  // Retourner le quiz complet
  return {
    id: quizData.id,
    lesson_id: quizData.lesson_id,
    title: quizData.title,
    description: quizData.description,
    is_required: quizData.is_required,
    passing_score: quizData.passing_score,
  }
}

// Mettre à jour un quiz existant
export const updateQuiz = async (quiz: QuizType): Promise<QuizType> => {
  // Mettre à jour le quiz
  const { error: quizError } = await supabase
    .from("quizzes")
    .update({
      title: quiz.title,
      description: quiz.description,
      is_required: quiz.is_required,
      passing_score: quiz.passing_score,
    })
    .eq("id", quiz.id)

  if (quizError) {
    console.error(`Erreur lors de la mise à jour du quiz #${quiz.id}:`, quizError)
    throw quizError
  }

  // Supprimer toutes les questions et options existantes
  const { error: deleteQuestionsError } = await supabase.from("quiz_questions").delete().eq("quiz_id", quiz.id)

  if (deleteQuestionsError) {
    console.error(`Erreur lors de la suppression des questions du quiz #${quiz.id}:`, deleteQuestionsError)
    throw deleteQuestionsError
  }

  // Retourner le quiz mis à jour
  return {
    ...quiz,
  }
}

// Supprimer un quiz
export const deleteQuiz = async (quizId: number): Promise<void> => {
  const { error } = await supabase.from("quizzes").delete().eq("id", quizId)

  if (error) {
    console.error(`Erreur lors de la suppression du quiz #${quizId}:`, error)
    throw error
  }
}

// Soumettre les réponses d'un utilisateur à un quiz
export const submitQuizAnswers = async (
  quiz: QuizType,
  userId: string,
  answers: { question_id: number; selected_option_id: number }[],
): Promise<QuizResultType> => {
  // Récupérer le quiz avec les questions et options
  if (!quiz) {
    throw new Error(`Quiz #${quiz.id} non trouvé`)
  }

  const questions = await fetchQuestionByQuizId(quiz.id)
  if (!questions) {
    throw new Error(`Aucune question trouvée pour le quiz #${quiz.id}`)
  }

  // Calculer le score
  let totalPoints = 0
  let earnedPoints = 0
  const userAnswers = []

  for (const question of questions) {
    totalPoints += question.points
    const userAnswer = answers.find((a) => a.question_id === question.id)

    if (!userAnswer) {
      console.warn(`Aucune réponse trouvée pour la question #${question.id}`)
      continue
    }

    if (userAnswer) {
      const options = await fetchOptionByQuestionId(question.id)
      if (!options) {
        throw new Error(`Aucune option trouvée pour la question #${question.id}`)
      }

      const selectedOption = options.find((o) => o.id === userAnswer.selected_option_id)
      const isCorrect = selectedOption?.is_correct || false

      if (isCorrect) {
        earnedPoints += question.points
      }

      userAnswers.push({
        questionId: question.id,
        selectedOptionId: userAnswer.selected_option_id,
        isCorrect,
      })
    }
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  const passed = score >= quiz.passing_score

  // Enregistrer le résultat du quiz
  const { data: resultData, error: resultError } = await supabase
    .from("quiz_results")
    .insert({
      quiz_id: quiz.id,
      user_id: userId,
      score,
      passed,
    })
    .select()
    .single()

  if (resultError) {
    console.error("Erreur lors de l'enregistrement du résultat du quiz:", resultError)
    throw resultError
  }

  const resultId = resultData.id

  // Enregistrer les réponses de l'utilisateur
  for (const answer of userAnswers) {
    const { error: answerError } = await supabase
      .from("quiz_user_answers").
      insert({
        quiz_result_id: resultId,
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_correct: answer.isCorrect,
      })

    if (answerError) {
      console.error("Erreur lors de l'enregistrement de la réponse de l'utilisateur:", answerError)
      throw answerError
    }
  }

  return {
    id: resultId,
    quiz_id: quiz.id,
    user_id: userId,
    score,
    passed,
    completed_at: resultData.completed_at,
  }
}

// Récupérer les résultats d'un quiz pour un utilisateur
export const fetchQuizResultForUser = async (quizId: number, userId: string): Promise<QuizResultType | null> => {
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error(`Erreur lors de la récupération du résultat du quiz #${quizId} pour l'utilisateur #${userId}:`, error)
    throw error
  }

  if (!data) return null

  return {
    id: data.id,
    quiz_id: data.quiz_id,
    user_id: data.user_id,
    score: data.score,
    passed: data.passed,
    completed_at: data.completed_at,
  }
}


export const createQuestion = async (question: QuizQuestionType): Promise<QuizQuestionType> => {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: question.quiz_id,
      question_text: question.question_text,
      question_type: question.question_type,
      points: question.points,
      question_order: question.question_order
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de la question:", error)
    throw error
  }

  return {
    id: data.id,
    quiz_id: data.quiz_id,
    question_text: data.question_text,
    question_type: data.question_type as "multiple_choice" | "true_false" | "single_choice",
    points: data.points,
    question_order: data.question_order
  }
}

export const updateQuestion = async (question: QuizQuestionType): Promise<QuizQuestionType> => {
  const { error } = await supabase
    .from("quiz_questions")
    .update({
      question_text: question.question_text,
      question_type: question.question_type,
      points: question.points,
      question_order: question.question_order
    })
    .eq("id", question.id)

  if (error) {
    console.error(`Erreur lors de la mise à jour de la question #${question.id}:`, error)
    throw error
  }

  return question
}

export const deleteQuestion = async (questionId: number): Promise<void> => {
  const { error } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("id", questionId)

  if (error) {
    console.error(`Erreur lors de la suppression de la question #${questionId}:`, error)
    throw error
  }
}

export const createOption = async (option: QuizOptionType): Promise<QuizOptionType> => {
  const { data, error } = await supabase
    .from("quiz_options")
    .insert({
      question_id: option.question_id,
      option_text: option.option_text,
      is_correct: option.is_correct,
      option_order: option.option_order
    })
    .select()
    .single()

  if (error) {
    console.error("Erreur lors de la création de l'option:", error)
    throw error
  }

  return data
}

export const updateOption = async (option: QuizOptionType): Promise<QuizOptionType> => {
  const { error } = await supabase
    .from("quiz_options")
    .update({
      option_text: option.option_text,
      is_correct: option.is_correct,
      option_order: option.option_order
    })
    .eq("id", option.id)

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'option #${option.id}:`, error)
    throw error
  }

  return option
}

export const deleteOption = async (optionId: number): Promise<void> => {
  const { error } = await supabase
    .from("quiz_options")
    .delete()
    .eq("id", optionId)

  if (error) {
    console.error(`Erreur lors de la suppression de l'option #${optionId}:`, error)
    throw error
  }
}
