import axios from 'axios'
import type { QuizDifficulty, QuizQuestion } from '@/types/quiz'

interface OpenTdbResponse {
	response_code: number
	results: Array<{
		question: string
		correct_answer: string
		incorrect_answers: string[]
	}>
}

const api = axios.create({
	baseURL: 'https://opentdb.com',
	timeout: 10000
})

function decodeHtml(value: string): string {
	const parser = new DOMParser()
	const doc = parser.parseFromString(value, 'text/html')
	return doc.documentElement.textContent ?? value
}

function shuffle<T>(items: T[]): T[] {
	const copy = [...items]
	for (let i = copy.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1))
		const current = copy[i]
		const target = copy[j]

		if (current === undefined || target === undefined) {
			continue
		}

		copy[i] = target
		copy[j] = current
	}
	return copy
}

export async function fetchQuizQuestions(difficulty: QuizDifficulty): Promise<QuizQuestion[]> {
	const { data } = await api.get<OpenTdbResponse>('/api.php', {
		params: {
			amount: 5,
			category: 21,
			difficulty,
			type: 'multiple'
		}
	})

	if (data.response_code !== 0) {
		throw new Error('Unable to fetch quiz questions from API.')
	}

	return data.results.map((item) => {
		const correctAnswer = decodeHtml(item.correct_answer)
		const wrongAnswers = item.incorrect_answers.map(decodeHtml)

		return {
			question: decodeHtml(item.question),
			choices: shuffle([correctAnswer, ...wrongAnswers]),
			correctAnswer
		}
	})
}
