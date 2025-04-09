<template>
  <div>
    <RouterView :class="backgroundClass"></RouterView>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped></style>