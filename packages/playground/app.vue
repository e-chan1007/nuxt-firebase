<template>
  <div>
    <Navbar />
    <div class="wrapper">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
}
</style>

<style lang="scss" scoped>
.wrapper {
  padding: 8px 32px;
}
</style>
