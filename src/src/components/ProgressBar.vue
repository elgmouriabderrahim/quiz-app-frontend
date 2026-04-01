<script setup lang="ts">
interface Props {
	value: number
}

defineProps<Props>()
</script>

<template>
	<div class="space-y-2">
		<div class="flex items-center justify-between text-xs font-medium text-slate-600">
			<span>Progress</span>
			<span>{{ Math.round(value) }}%</span>
		</div>
		<div class="h-3 w-full overflow-hidden rounded-full bg-slate-200">
			<div
				class="h-full rounded-full bg-gradient-to-r from-orange-400 to-sky-500 transition-all duration-500"
				:style="{ width: `${Math.max(0, Math.min(100, value))}%` }"
			/>
		</div>
	</div>
</template>