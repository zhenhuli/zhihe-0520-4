export type QuestionType = 'multiple_choice' | 'practical_essay'
export type SkillLevel = 'elementary' | 'intermediate' | 'advanced' | 'expert'

export interface QuestionOption {
  key: string
  text: string
}

export interface Question {
  id: string
  type: QuestionType
  title: string
  level: SkillLevel
  category: string
  options?: QuestionOption[]
  correctAnswer: string
  explanation: string
  points: number
  createdAt: number
}

export interface ExamSettings {
  duration: number
  passScore: number
  questionCount: number
  level: SkillLevel
  includePractical: boolean
  practicalPoints: number
}

export interface ExamAnswer {
  questionId: string
  answer: string
  isCorrect?: boolean
  score?: number
  needsReview?: boolean
  isReviewed?: boolean
  manualScore?: number
}

export interface ExamResult {
  id: string
  startTime: number
  endTime: number
  answers: ExamAnswer[]
  totalScore: number
  maxScore: number
  isPassed: boolean
  wrongAnswers: ExamAnswer[]
  isReviewed: boolean
  pendingReviewCount: number
}

export const skillLevelLabels: Record<SkillLevel, string> = {
  elementary: '初级',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家级'
}

export const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: '理论选择题',
  practical_essay: '实操简答题'
}
