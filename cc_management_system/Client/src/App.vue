<template>
  <div id="app">
    <headerComponent />
    <div class="content-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderComponent from './components/headerComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Ubuntu', sans-serif; 
}

#app {
  min-height: 100vh; /* Mindesthöhe des App-Containers */
  background-color: #F4F4F4;
  display: flex;
  flex-direction: column;
}

.content-container {
  flex-grow: 1; /* Ermöglicht es dem Container, den verfügbaren Platz auszufüllen */
  padding-top: 90px; /* Höhe des Headers */
}
</style>
