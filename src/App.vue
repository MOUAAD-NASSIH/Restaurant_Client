<script setup>
import NavBar from "./components/NavBar.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { onMounted } from "vue";
import { useStore } from "./stores/store.js";
import { storeToRefs } from "pinia";

const store = useStore();
const { admin } = storeToRefs(store);
const { getFoodsData } = store;

onMounted(() => {
  getFoodsData();
});
</script>

<template>
  <div id="app">
    <div v-if="admin">
      <router-view></router-view>
    </div>
    <div v-else>
      <NavBar />

      <div class="auth-wrapper">
        <div class="auth-inner">
          <router-view></router-view>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>
