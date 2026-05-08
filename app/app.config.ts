export default defineAppConfig({
  ui: {
    // Nuxt UI 4 configuration
    primary: 'green',
    gray: 'neutral',

    // Global component defaults using defaultVariants
    button: {
      rounded: 'rounded-xl',
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'solid',
      },
    },

    input: {
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline',
      },
    },

    card: {
      rounded: 'rounded-xl',
      shadow: 'shadow-sm',
      ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
    },

    // Notification/Toast configuration
    notification: {
      timeout: 5000,
    },
  },
})
