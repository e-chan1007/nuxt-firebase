<script lang="ts" setup>
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const { auth } = useAuth()

// You can sign in by using `signInWithPopup` imported from `firebase/auth`:
const signIn = () => signInWithPopup(auth!, new GoogleAuthProvider()).then(() => { navigateTo('/user') })

</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="signIn">
      Sign in with Google
    </button>
  </div>
</template>
