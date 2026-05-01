<script setup lang="ts">
import siteMeta from './site'

useSchemaOrg([
  defineOrganization({
    name: siteMeta.organization.name,
    logo: siteMeta.organization.logo,
    sameAs: siteMeta.organization.sameAs,
    address: {
      addressCountry: 'ID',
      addressLocality: 'Yogyakarta Magelang',
      addressRegion: 'Jawa Tengah & DIY',
    },
    contactPoint: {
      email: siteMeta.organization.email,
      telephone: siteMeta.organization.phone,
    },
    description: siteMeta.organization.description,
  }),
  defineWebSite({
    name: siteMeta.title,
    description: siteMeta.description,
    inLanguage: 'id-ID',
  })
])
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <FirstVisitModal />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>