<script setup>
import AxiosInstance from "../axios";
import { ref, computed, onMounted } from "vue";
import { useStore } from "../stores/store.js";
import { storeToRefs } from "pinia";
const props = defineProps(["bill"]);

const store = useStore();
const { allFoods } = storeToRefs(store);

const allFoodsInBill = ref([]);
const item_qty = ref([]);
const billMatch = ref(undefined);

const filterFoods = computed(() => {
  return allFoods.value.filter((f) => matchID(f, allFoodsInBill.value));
});

function getImageSrc(filename) {
  const imageUrl = new URL(`../assets/images/${filename}`, import.meta.url)
    .href;
  return imageUrl;
}
function matchID(food, cartArray) {
  let temp = "";
  cartArray.forEach((element) => {
    if (parseInt(food.food_id) == element) {
      temp = food;
    }
  });
  return temp;
}
async function getAllFoods() {
  if (props.bill) {
    let res = (await AxiosInstance.get("/billdetails/" + props.bill)).data;
    res.forEach((element) => {
      allFoodsInBill.value.push(element.food_id);
      item_qty.value.push(element.item_qty);
    });
  }
}
async function getBillStatus() {
  if (props.bill) {
    const res = (await AxiosInstance.get("/billstatus/bill/" + props.bill))
      .data[0];
    billMatch.value = res;
    console.log(res);
  }
}

onMounted(() => {
  getAllFoods();
  getBillStatus();
});
</script>

<template>
  <div class="order-details">
    <div class="order-details-inner">
      <h2 class="d-flex justify-content-between">
        Order summary
        <slot></slot>
      </h2>
      <div class="d-flex flex-wrap h-75 flex-row" style="overflow-y: auto">
        <div
          style="flex: 50%"
          v-for="(f, index) in filterFoods"
          :key="f.food_id"
        >
          <div class="product-detail d-flex">
            <div class="image">
              <img :src="getImageSrc(f.food_src)" alt="" />
            </div>
            <div class="content">
              <p class="name">
                {{ f.food_name }} <span>X {{ item_qty[index] }}</span>
              </p>
              <p class="desc">{{ f.food_desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.order-details {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-details .order-details-inner {
  width: 60vw;
  height: 70vh;
  background-color: #fff;
  padding: 32px;
}

.order-details .order-details-inner h2 {
  margin: 0;
  font-size: 32px;
  color: #27ae60;
  margin-bottom: 20px;
}

.order-details .order-details-inner .product-detail .image img {
  height: 8rem;
  width: 8rem;
  margin: 20px;
}

.order-details .order-details-inner .product-detail .content {
  margin-top: 20px;
  font-size: 12px;
  width: 100%;
}

.order-details .order-details-inner .product-detail .content p:first-of-type {
  font-size: 16px;
  color: #f38609;
}

.order-details .order-details-inner .product-detail .content p span {
  font-size: 14px;
  color: black;
}

.order-details .order-details-inner .price {
  margin-top: 30px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .order-details .order-details-inner {
    width: 80vw;
    height: 60vh;
  }

  .order-details .order-details-inner h2 {
    font-size: 20px;
  }

  .order-details .order-details-inner .product-detail .content .desc,
  .order-details .order-details-inner .product-detail .content .name span {
    font-size: 12px !important;
  }

  .order-details .order-details-inner .product-detail .content .name {
    font-size: 14px !important;
  }
}

@media (max-width: 576px) {
  .order-details .order-details-inner {
    width: 90vw;
    height: 65vh;
  }

  .order-details .order-details-inner div:first-of-type {
    flex-direction: column;
  }
}

@media (max-width: 376px) {
  .order-details .order-details-inner {
    width: 90vw;
    height: 65vh;
    padding: 5px !important;
  }

  .order-details .order-details-inner .product-detail .content .name {
    font-size: 12px !important;
  }
}
</style>
