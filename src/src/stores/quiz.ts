import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchQuizQuestions } from '@/services/api'
import {
  LEVEL_TO_DIFFICULTY,
  MAX_LEVEL,
  PASSING_SCORE_BY_LEVEL,
  POINTS_PER_CORRECT_ANSWER,
  TOTAL_TIME_SECONDS,
  type QuizQuestion,
  type QuizStatus
} from '@/types/quiz'

const BEST_SCORE_KEY = 'quiz-best-score'

function playAnswerSound(isCorrect: boolean): void {
  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = isCorrect ? 680 : 230
  gainNode.gain.value = 0.04

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.12)
}

export const useQuizStore = defineStore('quiz', () => {
  const level = ref(1)
  const score = ref(0)
  const levelScore = ref(0)
  const questions = ref<QuizQuestion[]>([])
  const currentQuestionIndex = ref(0)
  const selectedAnswer = ref<string | null>(null)
  const timeLeft = ref(TOTAL_TIME_SECONDS)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const status = ref<QuizStatus>('idle')
  const bestScore = ref(Number(localStorage.getItem(BEST_SCORE_KEY) ?? '0'))

  let timerId: number | null = null

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] ?? null)
  const hasNextQuestion = computed(() => currentQuestionIndex.value < questions.value.length - 1)
  const progressPercent = computed(() => {
    if (!questions.value.length) return 0
    return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
  })
  const gameEnded = computed(() => ['won', 'failed', 'game-over'].includes(status.value))
  const resultTitle = computed(() => {
    if (status.value === 'won') return 'YOU WIN !!'
    if (status.value === 'game-over') return 'GAME OVER'
    return 'Quiz Ended'
  })
  const resultDescription = computed(() => {
    if (status.value === 'won') {
      return `Amazing run. You cleared all levels with ${score.value} points.`
    }

    if (status.value === 'game-over') {
      return `Time reached zero. Final score: ${score.value}.`
    }

    return `You did not reach the required score for level ${level.value}. Final score: ${score.value}.`
  })

  function startTimer(): void {
    if (timerId !== null || gameEnded.value) return

    if (status.value === 'idle') {
      status.value = 'playing'
    }

    timerId = window.setInterval(() => {
      if (timeLeft.value <= 0) {
        stopTimer()
        status.value = 'game-over'
        persistBestScore()
        return
      }

      timeLeft.value -= 1
    }, 1000)
  }

  function stopTimer(): void {
    if (timerId === null) return
    window.clearInterval(timerId)
    timerId = null
  }

  async function fetchQuestions(targetLevel: number = level.value): Promise<void> {
    const difficulty = LEVEL_TO_DIFFICULTY[targetLevel]
    if (!difficulty) {
      throw new Error('Invalid level provided.')
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchQuizQuestions(difficulty)
      questions.value = data
      currentQuestionIndex.value = 0
      selectedAnswer.value = null
      status.value = 'playing'

      if (timerId === null) {
        startTimer()
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error while loading questions.'
    } finally {
      loading.value = false
    }
  }

  function selectAnswer(answer: string): void {
    if (!currentQuestion.value || selectedAnswer.value || gameEnded.value) return

    selectedAnswer.value = answer
    const isCorrect = answer === currentQuestion.value.correctAnswer

    if (isCorrect) {
      score.value += POINTS_PER_CORRECT_ANSWER
      levelScore.value += POINTS_PER_CORRECT_ANSWER
    }

    playAnswerSound(isCorrect)
  }

  async function nextQuestion(): Promise<void> {
    if (gameEnded.value) return

    if (hasNextQuestion.value) {
      currentQuestionIndex.value += 1
      selectedAnswer.value = null
      return
    }

    const requiredScore = PASSING_SCORE_BY_LEVEL[level.value] ?? Number.MAX_SAFE_INTEGER
    const levelPassed = levelScore.value >= requiredScore

    if (!levelPassed) {
      status.value = 'failed'
      stopTimer()
      persistBestScore()
      return
    }

    if (level.value === MAX_LEVEL) {
      status.value = 'won'
      stopTimer()
      persistBestScore()
      return
    }

    await nextLevel()
  }

  async function nextLevel(): Promise<void> {
    level.value += 1
    levelScore.value = 0
    await fetchQuestions(level.value)
  }

  function persistBestScore(): void {
    if (score.value <= bestScore.value) return
    bestScore.value = score.value
    localStorage.setItem(BEST_SCORE_KEY, String(bestScore.value))
  }

  function resetGame(): void {
    stopTimer()
    level.value = 1
    score.value = 0
    levelScore.value = 0
    questions.value = []
    currentQuestionIndex.value = 0
    selectedAnswer.value = null
    timeLeft.value = TOTAL_TIME_SECONDS
    loading.value = false
    error.value = null
    status.value = 'idle'
  }

  return {
    level,
    score,
    levelScore,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    loading,
    error,
    status,
    bestScore,
    currentQuestion,
    progressPercent,
    gameEnded,
    resultTitle,
    resultDescription,
    fetchQuestions,
    selectAnswer,
    nextQuestion,
    nextLevel,
    resetGame,
    startTimer,
    stopTimer
  }
})