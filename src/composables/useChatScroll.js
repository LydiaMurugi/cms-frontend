// important composable to auto-scroll chat container on new messages
import { watch, nextTick } from 'vue'

export function useChatScroll(messages, containerRef) {
  watch(messages, async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}
