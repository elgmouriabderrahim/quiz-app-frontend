<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from '@/components/ProgressBar.vue'
import Question from '@/components/Question.vue'
import Timer from '@/components/Timer.vue'
import { useQuizStore } from '@/stores/quiz'

const quizStore = useQuizStore()
const router = useRouter()

async function handleAnswer(answer: string): Promise<void> {
	quizStore.selectAnswer(answer)

	// Brief delay so the user can see correct/incorrect feedback before moving on.
	window.setTimeout(async () => {
		await quizStore.nextQuestion()

		if (quizStore.gameEnded) {
			await router.push('/result')
		}
	}, 600)
}

onMounted(async () => {
	if (!quizStore.questions.length && quizStore.status === 'idle') {
		await router.push('/')
		return
	}

	if (!quizStore.gameEnded) {
		quizStore.startTimer()
	}
})

watch(
	() => quizStore.status,
	async (newStatus) => {
		if (['won', 'failed', 'game-over'].includes(newStatus)) {
			await router.push('/result')
		}
	}
)
</script>

<template>
	<section class="mx-auto w-full max-w-4xl">
		<div class="rounded-3xl border border-slate-200 bg-[var(--panel)] p-6 shadow-xl sm:p-8">
			<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Level {{ quizStore.level }}</p>
					<h1 class="text-2xl font-bold text-slate-900">Current score: {{ quizStore.score }}</h1>
				</div>

				<Timer :time-left="quizStore.timeLeft" />
			</div>

			<ProgressBar :value="quizStore.progressPercent" />

			<div class="mt-7">
				<p v-if="quizStore.loading" class="font-medium text-slate-600">Loading questions...</p>
				<p v-else-if="quizStore.error" class="font-medium text-rose-600">{{ quizStore.error }}</p>

				<Question
					v-else-if="quizStore.currentQuestion"
					:question="quizStore.currentQuestion.question"
					:choices="quizStore.currentQuestion.choices"
					:correct-answer="quizStore.currentQuestion.correctAnswer"
					:selected-answer="quizStore.selectedAnswer"
					@select="handleAnswer"
				/>
			</div>
		</div>
	</section>
</template>
