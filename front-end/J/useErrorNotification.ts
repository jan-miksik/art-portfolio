import { ref } from 'vue'
import { handleError, type ErrorCode } from '~/utils/errorHandler'

export interface ErrorNotification {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
  timestamp: number
}

const notifications = ref<ErrorNotification[]>([])


export default function useErrorNotification() {
  const showErrorNotification = (
    error: unknown,
    context?: string,
    code?: ErrorCode
  ): string => {
    const message = handleError(error, context, code)
    const notification: ErrorNotification = {
      id: `error-${Date.now()}-${Math.random()}`,
      message,
      type: 'error',
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    setTimeout(() => {
      removeErrorNotification(notification.id)
    }, 15000)
    
    return message
  }

  const showWarningNotification = (message: string): void => {
    const notification: ErrorNotification = {
      id: `warning-${Date.now()}-${Math.random()}`,
      message,
      type: 'warning',
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    setTimeout(() => {
      removeErrorNotification(notification.id)
    }, 5000)
  }

  const showInfoNotification = (message: string): void => {
    const notification: ErrorNotification = {
      id: `info-${Date.now()}-${Math.random()}`,
      message,
      type: 'info',
      timestamp: Date.now()
    }
    
    notifications.value.push(notification)
    
    setTimeout(() => {
      removeErrorNotification(notification.id)
    }, 3000)
  }

  const removeErrorNotification = (id: string): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = (): void => {
    notifications.value = []
  }

  return {
    notifications,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    removeErrorNotification,
    clearAllNotifications
  }
}

