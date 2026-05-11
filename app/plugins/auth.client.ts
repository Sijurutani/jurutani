export default defineNuxtPlugin(async () => {
  if (import.meta.server) return

  const profile = useProfile()
  await profile.initProfile()
})
