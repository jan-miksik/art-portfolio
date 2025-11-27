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
            :class="{ 'error-notifications__copy--copied': copiedNotifications.has(notification.id) }"
            @click="copyToClipboard(notification.message, notification.id)"
            :title="copiedNotifications.has(notification.id) ? 'Copied!' : 'Copy to clipboard'"
            aria-label="Copy error message"
          >
            <Transition name="icon" mode="out-in">
              <svg 
                v-if="!copiedNotifications.has(notification.id)"
                key="copy"
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
              <svg 
                v-else
                key="check"
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </Transition>
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
const copiedNotifications = ref<Set<string>>(new Set())
const copiedTimeouts = ref<Map<string, NodeJS.Timeout>>(new Map())

const copyToClipboard = async (text: string, notificationId: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedNotifications.value.add(notificationId)
    
    // Clear existing timeout for this notification
    const existingTimeout = copiedTimeouts.value.get(notificationId)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }
    
    // Set timeout to remove copied state
    const timeout = setTimeout(() => {
      copiedNotifications.value.delete(notificationId)
      copiedTimeouts.value.delete(notificationId)
    }, 2000)
    
    copiedTimeouts.value.set(notificationId, timeout)
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
      copiedNotifications.value.add(notificationId)
      
      // Clear existing timeout for this notification
      const existingTimeout = copiedTimeouts.value.get(notificationId)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }
      
      // Set timeout to remove copied state
      const timeout = setTimeout(() => {
        copiedNotifications.value.delete(notificationId)
        copiedTimeouts.value.delete(notificationId)
      }, 2000)
      
      copiedTimeouts.value.set(notificationId, timeout)
    } catch (fallbackErr) {
      console.error('Failed to copy:', fallbackErr)
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

onUnmounted(() => {
  // Clear all timeouts
  copiedTimeouts.value.forEach((timeout) => {
    clearTimeout(timeout)
  })
  copiedTimeouts.value.clear()
  copiedNotifications.value.clear()
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
    transition all 0.2s ease
    position relative

    &:hover
      opacity 1

    &--copied
      opacity 1
      color #4caf50
      
      svg
        animation checkmark 0.3s ease-out

@keyframes checkmark
  0%
    transform scale(0.8)
    opacity 0.5
  50%
    transform scale(1.1)
  100%
    transform scale(1)
    opacity 1

.icon-enter-active,
.icon-leave-active
  transition all 0.2s ease

.icon-enter-from
  transform scale(0.8)
  opacity 0

.icon-leave-to
  transform scale(0.8)
  opacity 0

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

