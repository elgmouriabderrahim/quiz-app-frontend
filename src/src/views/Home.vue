<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

async function startQuiz(): Promise<void> {
  quizStore.resetGame()
  await quizStore.fetchQuestions(1)
  if (!quizStore.error) {
    await router.push('/quiz')
  }
}
</script>

<template>
  <section class="mx-auto grid min-h-[85vh] max-w-4xl place-items-center">
    <div class="w-full rounded-3xl border border-amber-100 bg-[var(--panel)] p-8 shadow-xl sm:p-12">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Sports Trivia</p>
      <h1 class="mt-3 text-4xl font-black text-slate-900 sm:text-5xl">Vue Quiz Challenge</h1>
      <p class="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
        Beat 3 levels in under 5 minutes. You need 40 points to pass level 1, 60 for level 2,
        and 80 for level 3. Each correct answer gives 20 points.
      </p>

      <div class="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          class="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          @click="startQuiz"
        >
          Start Quiz
        </button>
        <p class="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">
          Best score: {{ quizStore.bestScore }}
        </p>
      </div>

      <p v-if="quizStore.error" class="mt-4 text-sm font-medium text-rose-600">
        {{ quizStore.error }}
      </p>
    </div>
  </section>
</template>