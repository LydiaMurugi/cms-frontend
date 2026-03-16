<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
// Root component
</script>

<style>
/* Global overrides to ensure scrolling works as expected */
html, body {
  overflow-y: auto !important;
}

.v-application {
  font-family: 'Inter', sans-serif !important;
}
</style>
