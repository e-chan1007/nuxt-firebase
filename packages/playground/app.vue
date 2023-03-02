<script lang="ts" setup>
import { getMessaging, MessagePayload, onMessage } from 'firebase/messaging'

const notifications = ref<MessagePayload[]>([])
onMounted(() => {
  const messaging = getMessaging()
  onMessage(messaging, (payload) => {
    notifications.value.push(payload)
  })
})
</script>

<template>
  <div>
    <Navbar />
    <div class="wrapper">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <NotificationToast v-model="notifications" />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}

.toast-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 96px;
  right: 32px;
  gap: 8px;
}
</style>

<style lang="scss" scoped>
.wrapper {
  padding: 8px 32px;
}
</style>
