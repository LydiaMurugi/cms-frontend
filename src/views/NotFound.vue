<template>
  <v-container class="text-center">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h4">404 - Page Not Found</v-card-title>
          <v-card-text>
            The page you're looking for doesn't exist.
          </v-card-text>
          <v-card-actions>
            <v-btn @click="$router.push('/')">Go Home</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>