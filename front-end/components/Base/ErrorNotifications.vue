<template>
  <div class="error-notifications">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'error-notifications__item',
          `error-notifications__item--${notification.type}`
        ]"
      >
        <span 
          class="error-notifications__message"
          :title="notification.message"
        >{{ notification.message }}</span>
        <div class="error-notifications__actions">
          <button
            class="error-notifications__copy"
            @click="copyToClipboard(notification.message)"
            :title="copyButtonText"
            aria-label="Copy error message"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            class="error-notifications__close"
            @click="removeErrorNotification(notification.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import useErrorNotification from '~/J/useErrorNotification'

const { notifications, removeErrorNotification } = useErrorNotification()
const copyButtonText = ref('Copy to clipboard')
const copiedTimeout = ref<NodeJS.Timeout | null>(null)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyButtonText.value = 'Copied!'
    
    if (copiedTimeout.value) {
      clearTimeout(copiedTimeout.value)
    }
    
    copiedTimeout.value = setTimeout(() => {
      copyButtonText.value = 'Copy to clipboard'
    }, 2000)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      copyButtonText.value = 'Copied!'
      
      if (copiedTimeout.value) {
        clearTimeout(copiedTimeout.value)
      }
      
      copiedTimeout.value = setTimeout(() => {
        copyButtonText.value = 'Copy to clipboard'
      }, 2000)
    } catch (fallbackErr) {
      console.error('Failed to copy:', fallbackErr)
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

onUnmounted(() => {
  if (copiedTimeout.value) {
    clearTimeout(copiedTimeout.value)
  }
})
</script>

<style lang="stylus" scoped>
.error-notifications
  position fixed
  top 1rem
  right 1rem
  z-index 10000
  display flex
  flex-direction column
  gap 0.5rem
  max-width 400px
  pointer-events none

  @media screen and (max-width 768px)
    top 0.5rem
    right 0.5rem
    left 0.5rem
    max-width 100%

  &__item
    display flex
    align-items center
    justify-content space-between
    gap 1rem
    padding 1rem 1.25rem
    border-radius 8px
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.15)
    background-color #fff
    pointer-events auto
    animation slideIn 0.3s ease-out

    &--error
      background-color #fee
      border-left 4px solid #f44336
      color #c62828

    &--warning
      background-color #fff8e1
      border-left 4px solid #ff9800
      color #e65100

    &--info
      background-color #e3f2fd
      border-left 4px solid #2196f3
      color #1565c0

  &__message
    flex 1
    font-size 0.9rem
    line-height 1.4
    word-wrap break-word
    user-select text
    cursor text

  &__actions
    display flex
    align-items center
    gap 0.5rem
    flex-shrink 0

  &__copy
    background none
    border none
    font-size 1.2rem
    line-height 1
    cursor pointer
    color inherit
    opacity 0.6
    padding 0
    width 24px
    height 24px
    display flex
    align-items center
    justify-content center
    transition opacity 0.2s

    &:hover
      opacity 1

  &__close
    flex-shrink 0
    background none
    border none
    font-size 1.5rem
    line-height 1
    cursor pointer
    color inherit
    opacity 0.6
    padding 0
    width 24px
    height 24px
    display flex
    align-items center
    justify-content center
    transition opacity 0.2s

    &:hover
      opacity 1

@keyframes slideIn
  from
    transform translateX(100%)
    opacity 0
  to
    transform translateX(0)
    opacity 1

.notification-enter-active
  transition all 0.3s ease-out

.notification-leave-active
  transition all 0.3s ease-in

.notification-enter-from
  transform translateX(100%)
  opacity 0

.notification-leave-to
  transform translateX(100%)
  opacity 0

.notification-move
  transition transform 0.3s ease
</style>

