"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import type { QuizQuestionType, QuizOptionType } from "@/data/quiz"

interface QuestionComponentProps {
  question: QuizQuestionType
  questionOptions: QuizOptionType[]
  onQuestionChange: (field: keyof QuizQuestionType, value: any) => void
  onOptionChange: (optionId: number, field: keyof QuizOptionType, value: any) => void
  onAddOption: () => void
  onDeleteOption: (optionId: number) => void
  onDeleteQuestion: () => void
  dragHandleProps: any
  draggableProps: any
  forwardedRef: any
}

const QuestionComponent = ({
  question,
  questionOptions,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onDeleteOption,
  onDeleteQuestion,
  dragHandleProps,
  draggableProps,
  forwardedRef,
}: QuestionComponentProps) => {

  return (
    <Card ref={forwardedRef} {...draggableProps} className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div {...dragHandleProps}>
              <GripVertical className="h-5 w-5 text-gray-400" />
            </div>
            <CardTitle className="text-lg">Question {question.question_order}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onDeleteQuestion}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-${question.id}-text`}>Texte de la question</Label>
          <Input
            id={`question-${question.id}-text`}
            value={question.question_text}
            onChange={(e) => onQuestionChange("question_text", e.target.value)}
            placeholder="Texte de la question"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}-type`}>Type de question</Label>
            <Select
              value={question.question_type}
              onValueChange={(value) =>
                onQuestionChange("question_type", value as "multiple_choice" | "true_false" | "single_choice")
              }
            >
              <SelectTrigger id={`question-${question.id}-type`}>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_choice">Choix unique</SelectItem>
                <SelectItem value="multiple_choice">Choix multiple</SelectItem>
                <SelectItem value="true_false">Vrai/Faux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}-points`}>Points</Label>
            <Select
              value={question.points.toString()}
              onValueChange={(value) => onQuestionChange("points", Number.parseInt(value))}
            >
              <SelectTrigger id={`question-${question.id}-points`}>
                <SelectValue placeholder="Points" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 point</SelectItem>
                <SelectItem value="2">2 points</SelectItem>
                <SelectItem value="3">3 points</SelectItem>
                <SelectItem value="5">5 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Options de réponse</Label>
            {question.question_type !== "true_false" && (
              <Button variant="outline" size="sm" onClick={onAddOption}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter une option
              </Button>
            )}
          </div>

          <Droppable droppableId={`options-${question.id}`} type="option">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {questionOptions.map((option, optionIndex) => (
                  <Draggable
                    key={`option-${question.id}-${option.id}`}
                    draggableId={`option-${question.id}-${option.id}`}
                    index={optionIndex}
                    isDragDisabled={question.question_type === "true_false"}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-2 border rounded-md bg-gray-50"
                      >
                        {question.question_type !== "true_false" && (
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-4 w-4 text-gray-400" />
                          </div>
                        )}

                        {question.question_type === "single_choice" && (
                          <div className="flex items-center">
                            <Checkbox
                              checked={option.is_correct}
                              onCheckedChange={(checked) => {
                                // Si on décoche, simplement mettre à false
                                if (!checked) {
                                  onOptionChange(option.id, "is_correct", false)
                                  return
                                }

                                // Si on coche, d'abord mettre toutes les autres options à false
                                const otherOptions = questionOptions.filter((o) => o.id !== option.id)
                                for (const otherOption of otherOptions) {
                                  onOptionChange(otherOption.id, "is_correct", false)
                                }

                                // Puis mettre celle-ci à true
                                onOptionChange(option.id, "is_correct", true)
                              }}
                              className="mr-2"
                            />
                            <Label htmlFor={`option-${question.id}-${option.id}`} className="cursor-pointer">
                              Réponse correcte
                            </Label>
                          </div>
                        )}

                        {question.question_type === "multiple_choice" && (
                          <Checkbox
                            checked={option.is_correct}
                            onCheckedChange={(checked) => {
                              onOptionChange(option.id, "is_correct", checked === true)
                            }}
                            className="mr-2"
                          />
                        )}

                        <Input
                          value={option.option_text}
                          onChange={(e) => onOptionChange(option.id, "option_text", e.target.value)}
                          placeholder="Texte de l'option"
                          disabled={question.question_type === "true_false"}
                          className="flex-1"
                        />

                        {question.question_type !== "true_false" && (
                          <Button variant="ghost" size="icon" onClick={() => onDeleteOption(option.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionComponent
