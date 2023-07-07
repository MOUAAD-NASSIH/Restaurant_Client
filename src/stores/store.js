import { defineStore } from "pinia";
import { ref, computed } from "vue";
import AxiosInstance from "../axios.js";

export const useStore = defineStore("store", () => {
  const allFoods = ref([]);
  // const token = ref(undefined);
  const user = ref(undefined);
  const admin = ref(undefined);

  const getAllFoods = computed(() => allFoods.value);
  const getUser = computed(() => user.value);
  const getAdmin = computed(() => admin.value);

  async function getFoodsData() {
    try {
      const res = await AxiosInstance.get("/foods");
      const { results, user } = res.data;
      // console.log("results : ", results);
      console.log("user : ", user);
      allFoods.value = results;
      setUser(user);
    } catch (err) {
      console.error(err);
    }
  }
  function setUser(payload) {
    user.value = payload;
  }
  function setAdmin(payload) {
    admin.value = payload;
  }

  return {
    allFoods,
    user,
    admin,
    getAllFoods,
    getUser,
    getAdmin,
    getFoodsData,
    setUser,
    setAdmin,
  };
});
