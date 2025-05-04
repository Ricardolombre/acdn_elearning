import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { QuizQuestionType, QuizOptionType } from "@/data/quiz"

interface QuestionPreviewProps {
  question: QuizQuestionType
  questionIndex: number
  options: QuizOptionType[]
}

const QuestionPreview = ({ question, questionIndex, options }: QuestionPreviewProps) => {
  return (
    <div className="space-y-4 border-b pb-4 last:border-b-0">
      <h3 className="font-medium">
        {questionIndex + 1}. {question.question_text}
        <span className="text-sm text-gray-500 ml-2">
          ({question.points} point{question.points > 1 ? "s" : ""})
        </span>
      </h3>

      {question.question_type === "single_choice" && (
        <RadioGroup>
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={`option-${option.id}`} id={`preview-${question.id}-${option.id}`} />
              <Label htmlFor={`preview-${question.id}-${option.id}`}>{option.option_text}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {question.question_type === "multiple_choice" && (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={`preview-${question.id}-${option.id}`} />
              <Label htmlFor={`preview-${question.id}-${option.id}`}>{option.option_text}</Label>
            </div>
          ))}
        </div>
      )}

      {question.question_type === "true_false" && (
        <RadioGroup>
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={`option-${option.id}`} id={`preview-${question.id}-${option.id}`} />
              <Label htmlFor={`preview-${question.id}-${option.id}`}>{option.option_text}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}

export default QuestionPreview
