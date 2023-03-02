<script lang="ts" setup>
const fcmToken = ref()
onMounted(() => {
  Notification.requestPermission().then(async (permission) => {
    if (permission === 'granted') {
      fcmToken.value = await useFCMToken()
    }
  })
})
</script>

<template>
  <div>
    <h1>Nuxt Firebase Playground</h1>
    <p>This page is public. No authentication is required.</p>
    <p>Firebase Cloud Messaging Token: {{ fcmToken }}</p>
    <a href="api/hello">API Route</a>
  </div>
</template>
