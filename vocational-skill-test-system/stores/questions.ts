import { defineStore } from 'pinia'
import type { Question, ExamSettings, ExamAnswer, ExamResult } from '~/composables/types'
import { defaultQuestions, defaultSettings } from '~/composables/data'

interface QuestionStoreState {
  questions: Question[]
  settings: ExamSettings
  currentExam: {
    questions: Question[]
    answers: ExamAnswer[]
    startTime: number | null
    isActive: boolean
  }
  examHistory: ExamResult[]
  wrongQuestionIds: string[]
}

export const useQuestionStore = defineStore('questions', {
  state: (): QuestionStoreState => ({
    questions: [],
    settings: { ...defaultSettings },
    currentExam: {
      questions: [],
      answers: [],
      startTime: null,
      isActive: false
    },
    examHistory: [],
    wrongQuestionIds: []
  }),

  getters: {
    getQuestionsByLevel: (state) => (level: string) => {
      return state.questions.filter(q => q.level === level)
    },
    getMultipleChoiceQuestions: (state) => {
      return state.questions.filter(q => q.type === 'multiple_choice')
    },
    getPracticalQuestions: (state) => {
      return state.questions.filter(q => q.type === 'practical_essay')
    },
    getWrongQuestions: (state) => {
      return state.questions.filter(q => state.wrongQuestionIds.includes(q.id))
    },
    statistics: (state) => {
      const total = state.questions.length
      const mcq = state.questions.filter(q => q.type === 'multiple_choice').length
      const practical = state.questions.filter(q => q.type === 'practical_essay').length
      const byLevel = {
        elementary: state.questions.filter(q => q.level === 'elementary').length,
        intermediate: state.questions.filter(q => q.level === 'intermediate').length,
        advanced: state.questions.filter(q => q.level === 'advanced').length,
        expert: state.questions.filter(q => q.level === 'expert').length
      }
      return { total, mcq, practical, byLevel, wrongCount: state.wrongQuestionIds.length }
    }
  },

  actions: {
    init() {
      const storedQuestions = localStorage.getItem('questions')
      const storedSettings = localStorage.getItem('examSettings')
      const storedHistory = localStorage.getItem('examHistory')
      const storedWrongIds = localStorage.getItem('wrongQuestionIds')

      if (storedQuestions) {
        this.questions = JSON.parse(storedQuestions)
      } else {
        this.questions = [...defaultQuestions]
        this.saveQuestions()
      }

      if (storedSettings) {
        this.settings = JSON.parse(storedSettings)
      }

      if (storedHistory) {
        this.examHistory = JSON.parse(storedHistory)
      }

      if (storedWrongIds) {
        this.wrongQuestionIds = JSON.parse(storedWrongIds)
      }
    },

    saveQuestions() {
      localStorage.setItem('questions', JSON.stringify(this.questions))
    },

    saveSettings() {
      localStorage.setItem('examSettings', JSON.stringify(this.settings))
    },

    saveHistory() {
      localStorage.setItem('examHistory', JSON.stringify(this.examHistory))
    },

    saveWrongQuestions() {
      localStorage.setItem('wrongQuestionIds', JSON.stringify(this.wrongQuestionIds))
    },

    addQuestion(question: Omit<Question, 'id' | 'createdAt'>) {
      const newQuestion: Question = {
        ...question,
        id: `q${Date.now()}`,
        createdAt: Date.now()
      }
      this.questions.push(newQuestion)
      this.saveQuestions()
      return newQuestion
    },

    updateQuestion(id: string, updates: Partial<Question>) {
      const index = this.questions.findIndex(q => q.id === id)
      if (index !== -1) {
        this.questions[index] = { ...this.questions[index], ...updates }
        this.saveQuestions()
      }
    },

    deleteQuestion(id: string) {
      this.questions = this.questions.filter(q => q.id !== id)
      this.wrongQuestionIds = this.wrongQuestionIds.filter(qid => qid !== id)
      this.saveQuestions()
      this.saveWrongQuestions()
    },

    startExam() {
      const { level, questionCount, includePractical } = this.settings
      
      let availableQuestions = this.questions.filter(q => q.level === level)
      
      if (!includePractical) {
        availableQuestions = availableQuestions.filter(q => q.type === 'multiple_choice')
      }

      const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length))

      this.currentExam = {
        questions: selected,
        answers: selected.map(q => ({ questionId: q.id, answer: '' })),
        startTime: Date.now(),
        isActive: true
      }
    },

    submitAnswer(questionId: string, answer: string) {
      const answerIndex = this.currentExam.answers.findIndex(a => a.questionId === questionId)
      if (answerIndex !== -1) {
        this.currentExam.answers[answerIndex].answer = answer
      }
    },

    finishExam(): ExamResult {
      const { passScore } = this.settings
      const endTime = Date.now()
      
      const gradedAnswers: ExamAnswer[] = this.currentExam.answers.map(answer => {
        const question = this.currentExam.questions.find(q => q.id === answer.questionId)
        if (!question) return { ...answer, isCorrect: false, score: 0 }

        let isCorrect = false
        let score = 0
        let needsReview = false
        let isReviewed = true

        if (question.type === 'multiple_choice') {
          isCorrect = answer.answer.toUpperCase() === question.correctAnswer.toUpperCase()
          score = isCorrect ? question.points : 0
        } else {
          needsReview = true
          isReviewed = false
          score = 0
        }

        return { ...answer, isCorrect, score, needsReview, isReviewed }
      })

      const scoredAnswers = gradedAnswers.filter(a => a.isReviewed)
      const pendingAnswers = gradedAnswers.filter(a => a.needsReview && !a.isReviewed)
      
      const totalScore = scoredAnswers.reduce((sum, a) => sum + (a.score || 0), 0)
      const maxScore = this.currentExam.questions.reduce((sum, q) => sum + q.points, 0)
      const reviewedMaxScore = scoredAnswers.reduce((sum, a) => {
        const q = this.currentExam.questions.find(q => q.id === a.questionId)
        return sum + (q?.points || 0)
      }, 0)
      
      const isPassed = reviewedMaxScore > 0 
        ? (totalScore / reviewedMaxScore * 100) >= passScore 
        : false
      
      const wrongAnswers = gradedAnswers.filter(a => a.isReviewed && !a.isCorrect)

      const result: ExamResult = {
        id: `exam${Date.now()}`,
        startTime: this.currentExam.startTime || Date.now(),
        endTime,
        answers: gradedAnswers,
        totalScore,
        maxScore,
        isPassed,
        wrongAnswers,
        isReviewed: pendingAnswers.length === 0,
        pendingReviewCount: pendingAnswers.length
      }

      this.examHistory.unshift(result)
      this.saveHistory()

      const newWrongIds = wrongAnswers.map(a => a.questionId)
      newWrongIds.forEach(id => {
        if (!this.wrongQuestionIds.includes(id)) {
          this.wrongQuestionIds.push(id)
        }
      })
      this.saveWrongQuestions()

      this.currentExam = {
        questions: [],
        answers: [],
        startTime: null,
        isActive: false
      }

      return result
    },

    reviewAnswer(examId: string, questionId: string, score: number, isCorrect: boolean) {
      const examIndex = this.examHistory.findIndex(e => e.id === examId)
      if (examIndex === -1) return

      const answerIndex = this.examHistory[examIndex].answers.findIndex(a => a.questionId === questionId)
      if (answerIndex === -1) return

      this.examHistory[examIndex].answers[answerIndex].manualScore = score
      this.examHistory[examIndex].answers[answerIndex].score = score
      this.examHistory[examIndex].answers[answerIndex].isCorrect = isCorrect
      this.examHistory[examIndex].answers[answerIndex].isReviewed = true
      this.examHistory[examIndex].answers[answerIndex].needsReview = false

      const allAnswers = this.examHistory[examIndex].answers
      const totalScore = allAnswers.reduce((sum, a) => sum + (a.score || 0), 0)
      const maxScore = this.examHistory[examIndex].maxScore
      const isPassed = (totalScore / maxScore * 100) >= this.settings.passScore
      
      this.examHistory[examIndex].totalScore = totalScore
      this.examHistory[examIndex].isPassed = isPassed
      this.examHistory[examIndex].pendingReviewCount = allAnswers.filter(a => a.needsReview && !a.isReviewed).length
      this.examHistory[examIndex].isReviewed = this.examHistory[examIndex].pendingReviewCount === 0

      const wrongAnswers = allAnswers.filter(a => a.isReviewed && !a.isCorrect)
      this.examHistory[examIndex].wrongAnswers = wrongAnswers

      if (isCorrect) {
        this.wrongQuestionIds = this.wrongQuestionIds.filter(id => id !== questionId)
      } else {
        if (!this.wrongQuestionIds.includes(questionId)) {
          this.wrongQuestionIds.push(questionId)
        }
      }

      this.saveHistory()
      this.saveWrongQuestions()

      return this.examHistory[examIndex]
    },

    startPractice() {
      const wrongQuestions = this.getWrongQuestions
      if (wrongQuestions.length === 0) return false

      this.currentExam = {
        questions: wrongQuestions,
        answers: wrongQuestions.map(q => ({ questionId: q.id, answer: '' })),
        startTime: Date.now(),
        isActive: true
      }
      return true
    },

    removeFromWrongQuestions(questionId: string) {
      this.wrongQuestionIds = this.wrongQuestionIds.filter(id => id !== questionId)
      this.saveWrongQuestions()
    },

    clearWrongQuestions() {
      this.wrongQuestionIds = []
      this.saveWrongQuestions()
    },

    resetAllData() {
      this.questions = [...defaultQuestions]
      this.settings = { ...defaultSettings }
      this.examHistory = []
      this.wrongQuestionIds = []
      this.saveQuestions()
      this.saveSettings()
      this.saveHistory()
      this.saveWrongQuestions()
    }
  }
})
