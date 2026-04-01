export type QuizDifficulty = 'easy' | 'medium' | 'hard'

export interface QuizQuestion {
  question: string
  choices: string[]
  correctAnswer: string
}

export type QuizStatus = 'idle' | 'playing' | 'won' | 'failed' | 'game-over'

export const LEVEL_TO_DIFFICULTY: Record<number, QuizDifficulty> = {
  1: 'easy',
  2: 'medium',
  3: 'hard'
}

export const PASSING_SCORE_BY_LEVEL: Record<number, number> = {
  1: 40,
  2: 60,
  3: 80
}

export const MAX_LEVEL = 3
export const QUESTIONS_PER_LEVEL = 5
export const POINTS_PER_CORRECT_ANSWER = 20
export const TOTAL_TIME_SECONDS = 300