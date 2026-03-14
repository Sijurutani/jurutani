type ToastType = 'success' | 'error' | 'info' | 'warning'

const toastColorMap: Record<ToastType, 'success' | 'error' | 'info' | 'warning'> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
}

const toastIconMap: Record<ToastType, string> = {
  success: 'i-lucide-check-circle',
  error: 'i-lucide-circle-x',
  info: 'i-lucide-info',
  warning: 'i-lucide-triangle-alert',
}

const pushToast = (
  message: string,
  type: ToastType = 'info',
  timeout = 3000,
) => {
  const toast = useToast()
  toast.add({
    title: message,
    color: toastColorMap[type],
    icon: toastIconMap[type],
    duration: timeout,
  })
}

export const usejuruTaniToast = () => {
  return {
    add: pushToast,
    remove: (_id: string | number) => {
      // no-op: Nuxt UI toast dikelola internal.
    },
    success: (message: string, timeout?: number) => pushToast(message, 'success', timeout),
    error: (message: string, timeout?: number) => pushToast(message, 'error', timeout),
    info: (message: string, timeout?: number) => pushToast(message, 'info', timeout),
    warning: (message: string, timeout?: number) => pushToast(message, 'warning', timeout),
  }
}

// Backward-compatible global API
export const toastStore = {
  add(message: string, type: ToastType = 'info', timeout = 3000) {
    pushToast(message, type, timeout)
  },

  remove(_id: string | number) {
    // no-op: Nuxt UI toast dikelola internal.
  },

  success(message: string, timeout?: number) {
    this.add(message, 'success', timeout)
  },

  error(message: string, timeout?: number) {
    this.add(message, 'error', timeout)
  },

  info(message: string, timeout?: number) {
    this.add(message, 'info', timeout)
  },

  warning(message: string, timeout?: number) {
    this.add(message, 'warning', timeout)
  },
}