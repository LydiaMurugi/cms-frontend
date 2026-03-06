import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/projectStore'

export function useMemberEvents() {
  const projectStore = useProjectStore()

  const selectedDate = ref(new Date())

  const formattedDate = computed(() =>
    selectedDate.value.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  )
 const dailyEvents = computed(() => {
    const selected = selectedDate.value.toISOString().split('T')[0]

    return projectStore.programs.filter(p => p.date === selected)
  })

  return {
    selectedDate,
    formattedDate,
    dailyEvents
  }
}
