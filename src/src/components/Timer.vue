<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	timeLeft: number
}

const props = defineProps<Props>()

const formattedTime = computed(() => {
	const safeTime = Math.max(0, props.timeLeft)
	const minutes = Math.floor(safeTime / 60)
	const seconds = safeTime % 60
	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const urgencyClass = computed(() => {
	if (props.timeLeft <= 30) return 'text-rose-600'
	if (props.timeLeft <= 90) return 'text-amber-600'
	return 'text-slate-700'
})
</script>

<template>
	<div class="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
		<p class="text-xs uppercase tracking-wide text-slate-500">Time Left</p>
		<p class="text-xl font-bold" :class="urgencyClass">{{ formattedTime }}</p>
	</div>
</template>
