<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz'

const router = useRouter()
const quizStore = useQuizStore()

const toneClass = computed(() => {
  if (quizStore.status === 'won') return 'text-emerald-600'
  if (quizStore.status === 'game-over') return 'text-rose-600'
  return 'text-amber-600'
})

async function playAgain(): Promise<void> {
  quizStore.resetGame()
  await router.push('/')
}

onMounted(async () => {
  if (!quizStore.gameEnded) {
    await router.push('/')
  }
})
</script>

<template>
  <section class="mx-auto grid min-h-[85vh] max-w-3xl place-items-center">
    <div class="w-full rounded-3xl border border-slate-200 bg-[var(--panel)] p-8 text-center shadow-xl sm:p-12">
      <h1 class="text-4xl font-black sm:text-5xl" :class="toneClass">
        {{ quizStore.resultTitle }}
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
        {{ quizStore.resultDescription }}
      </p>

      <div class="mt-8 grid gap-3 text-left text-sm text-slate-700 sm:grid-cols-3">
        <p class="rounded-xl border border-slate-200 bg-white px-4 py-3">
          Final score: <span class="font-bold">{{ quizStore.score }}</span>
        </p>
        <p class="rounded-xl border border-slate-200 bg-white px-4 py-3">
          Reached level: <span class="font-bold">{{ quizStore.level }}</span>
        </p>
        <p class="rounded-xl border border-slate-200 bg-white px-4 py-3">
          Best score: <span class="font-bold">{{ quizStore.bestScore }}</span>
        </p>
      </div>

      <button
        type="button"
        class="mt-8 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
        @click="playAgain"
      >
        Play Again
      </button>
    </div>
  </section>
</template>