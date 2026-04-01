<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	question: string
	choices: string[]
	selectedAnswer: string | null
	correctAnswer: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	select: [answer: string]
}>()

const hasSelected = computed(() => props.selectedAnswer !== null)

function buttonClass(choice: string): string {
	if (!props.selectedAnswer) {
		return 'border-slate-300 bg-white hover:border-sky-400 hover:bg-sky-50'
	}

	if (choice === props.correctAnswer) {
		return 'border-emerald-500 bg-emerald-100 text-emerald-900'
	}

	if (choice === props.selectedAnswer) {
		return 'border-rose-500 bg-rose-100 text-rose-900'
	}

	return 'border-slate-200 bg-slate-100 text-slate-500'
}
</script>

<template>
	<section class="space-y-6">
		<h2 class="text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl">
			{{ question }}
		</h2>

		<div class="grid gap-3">
			<button
				v-for="choice in choices"
				:key="choice"
				type="button"
				class="rounded-xl border px-4 py-3 text-left font-medium transition"
				:class="buttonClass(choice)"
				:disabled="hasSelected"
				@click="emit('select', choice)"
			>
				{{ choice }}
			</button>
		</div>
	</section>
</template>
