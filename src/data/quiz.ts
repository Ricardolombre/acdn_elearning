export interface QuizType {
    id: number
    lesson_id: number
    title: string
    description?: string
    is_required: boolean
    passing_score: number
  }
  
  export interface QuizQuestionType {
    id: number
    quiz_id: number
    question_text: string
    question_type: "multiple_choice" | "true_false" | "single_choice"
    points: number
    question_order: number
  }
  
  export interface QuizOptionType {
    id: number
    question_id: number
    option_text: string
    is_correct: boolean
    option_order: number
  }
  
  export interface QuizResultType {
    id: number
    quiz_id: number
    user_id: string
    score: number
    passed: boolean
    completed_at: string
  }
  
  export interface QuizUserAnswerType {
    id: number
    quiz_result_id: number
    question_id: number
    selected_option_id: number
    is_correct: boolean
  }
  