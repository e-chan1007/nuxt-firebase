<script lang="ts" setup>
import { definePageMeta, useAuth } from '#imports'

const { currentUser } = useAuth()

definePageMeta({
  middleware: 'auth' // If not authenticated, redirect to /login (see /middleware/auth.ts)
})
</script>

<template>
  <div v-if="currentUser">
    <h1>User</h1>
    <pre>{{ JSON.stringify(currentUser, null, 2) }}</pre>
  </div>
</template>
