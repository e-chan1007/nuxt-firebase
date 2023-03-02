<script lang="ts" setup>
import type { MessagePayload } from 'firebase/messaging'
import { watch } from '#imports'

const props = defineProps<{ modelValue: MessagePayload[]}>()
const emit = defineEmits<{(event: 'update:modelValue', value: MessagePayload[]): void }>()

watch(() => [...props.modelValue], (cur, old) => {
  if (cur.length > old.length) {
    setTimeout(() => emit('update:modelValue', props.modelValue.slice(1)), 5000)
  }
})
</script>

<template>
  <Teleport to="body">
    <TransitionGroup tag="div" name="slide-fade" class="toast-container">
      <div v-for="notification of modelValue" :key="notification.messageId" class="toast">
        <p class="title">
          {{ notification.notification?.title }}
        </p>
        <p>{{ notification.notification?.body }}</p>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style lang="scss">
.toast {
  background-color: white;
  box-shadow: 0 2px 4px gray;
  border-left: 16px solid orange;
  padding: 16px 24px;

  .title {
    font-size: 1.2em;
    font-weight: bold;
  }

  p {
    margin: 0;
  }
}

// from https://vuejs.org/guide/built-ins/transition.html#css-transitions
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
