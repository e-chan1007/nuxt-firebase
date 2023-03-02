<script lang="ts" setup>
import { signOut } from 'firebase/auth'
import { navigateTo, useAuth } from '#imports'

// Needless to say, you can use `useAuth` in components:
const { auth, currentUser } = useAuth()

const logOut = () => signOut(auth!).then(() => { navigateTo('/') })
</script>

<template>
  <nav>
    <NuxtLink href="/">
      <h1>Nuxt Firebase</h1>
    </NuxtLink>
    <div v-if="currentUser">
      <img :src="currentUser.photoURL ?? ''" width="48" height="48">
      <label>{{ currentUser.displayName }}</label>
      <a @click="logOut">Logout</a>
    </div>
    <div v-else>
      <NuxtLink href="/login">
        Login
      </NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 64px;
  background-color: orange;
  box-shadow: 0 2px 4px gray;

  a {
    color: inherit !important;
    text-decoration: none;
    cursor: pointer;
  }

  > div {
    display: flex;
    flex-flow: row;
    align-items: center;
    gap: 12px;
  }
}
</style>
