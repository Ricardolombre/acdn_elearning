export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: string
          enrolled_count: number | null
          id: number
          instructor: string
          instructor_id: string | null
          level: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: string
          enrolled_count?: number | null
          id?: number
          instructor: string
          instructor_id?: string | null
          level: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: string
          enrolled_count?: number | null
          id?: number
          instructor?: string
          instructor_id?: string | null
          level?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed: boolean | null
          course_id: number | null
          created_at: string | null
          id: number
          progress: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          course_id?: number | null
          created_at?: string | null
          id?: number
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          course_id?: number | null
          created_at?: string | null
          id?: number
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: number
          lesson_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          lesson_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: number
          lesson_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          video_url: string | null
          course_id: number | null
          created_at: string | null
          duration: string
          id: number
          is_locked: boolean | null
          lesson_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          video_url: string | null
          course_id?: number | null
          created_at?: string | null
          duration: string
          id?: number | null
          is_locked?: boolean | null
          lesson_order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          video_url: string | null
          course_id?: number | null
          created_at?: string | null
          duration?: string
          id?: number
          is_locked?: boolean | null
          lesson_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey1"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string | null
          date: string
          description: string
          download_url: string | null
          external_url: string | null
          id: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          date: string
          description: string
          download_url?: string | null
          external_url?: string | null
          id?: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          download_url?: string | null
          external_url?: string | null
          id?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          id: number
          lesson_id: number | null
          title: string
          description: string | null
          is_required: boolean
          passing_score: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          lesson_id?: number | null
          title: string
          description?: string | null
          is_required: boolean
          passing_score: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          lesson_id?: number | null
          title?: string
          description?: string | null
          is_required?: boolean
          passing_score?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          id: number
          quiz_id: number | null
          question_text: string
          question_type: string
          points: number
          question_order: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          quiz_id?: number | null
          question_text: string
          question_type: string
          points: number
          question_order: number
          created_at?: string | null
        }
        Update: {
          id?: number
          quiz_id?: number | null
          question_text?: string
          question_type?: string
          points?: number
          question_order?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_options: {
        Row: {
          id: number
          question_id: number | null
          option_text: string
          is_correct: boolean
          option_order: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          question_id?: number | null
          option_text: string
          is_correct: boolean
          option_order: number
          created_at?: string | null
        }
        Update: {
          id?: number
          question_id?: number | null
          option_text?: string
          is_correct?: boolean
          option_order?: number
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          id: number
          quiz_id: number | null
          user_id: string | null
          score: number
          passed: boolean
          completed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          quiz_id?: number | null
          user_id?: string | null
          score: number
          passed: boolean
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          quiz_id?: number | null
          user_id?: string | null
          score?: number
          passed?: boolean
          completed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_user_answers: {
        Row: {
          id: number
          quiz_result_id: number | null
          question_id: number | null
          selected_option_id: number | null
          is_correct: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          quiz_result_id?: number | null
          question_id?: number | null
          selected_option_id?: number | null
          is_correct: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          quiz_result_id?: number | null
          question_id?: number | null
          selected_option_id?: number | null
          is_correct?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_user_answers_quiz_result_id_fkey"
            columns: ["quiz_result_id"]
            isOneToOne: false
            referencedRelation: "quiz_results"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
