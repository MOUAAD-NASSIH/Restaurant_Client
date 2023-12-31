<script setup>
import AxiosInstance from "../axios.js";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "../stores/store.js";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
const { admin } = storeToRefs(store);
const { setAdmin } = store;
const allBills = ref([]);
const showOrderDetails = ref(false);
const interval = ref("");
const availableStatus = ref([
  "cancel",
  "confirmed",
  "preparing",
  "checking",
  "delivering",
  "delivered",
  "completed",
]);
const filterBills = computed(() => {
  return allBills.value.filter((b) => b.bill_status < 6 && b.bill_status > 0);
});

onMounted(() => {
  autoUpdate();
  getAllBills();
  if (!admin.value) {
    router.push("/admin");
  }
});
onBeforeUnmount(() => {
  clearInterval(interval.value);
});

function sendBillId(id) {
  sendId.value = id;
  showOrderDetails.value = !showOrderDetails.value;
}
function closeView() {
  showOrderDetails.value = !showOrderDetails.value;
}
function handleLogout() {
  setAdmin("");
}
function autoUpdate() {
  (interval.value = setInterval(() => {
    getAllBills();
  })),
    1000;
}
async function getAllBills() {
  allBills.value = (await AxiosInstance.get("/billstatus")).data;
}
async function nextStatusBtn(id) {
  await AxiosInstance.put("/billstatus/" + id);
  getAllBills();
}
async function paidBtn(id) {
  await AxiosInstance.put("/billstatus/paid/" + id);
  getAllBills();
}
async function cancelBtn(id) {
  await AxiosInstance.put("/billstatus/cancel/" + id);
  getAllBills();
}
</script>

<template>
  <div class="admin-container">
    <div class="d-flex justify-content-between">
      <h1>Hello Admin!</h1>
      <button class="btn" @click="handleLogout()">Logout</button>
    </div>

    <div class="table-responsive">
      <!-- PROJECT TABLE -->
      <table class="table colored-header datatable project-list">
        <thead>
          <tr>
            <th>Bill Id</th>
            <th>User Id</th>
            <th>Phone</th>
            <th>Address</th>
            <th>When</th>
            <th>Paid</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filterBills.slice().reverse()" :key="b.bill_id">
            <td>{{ b.bill_id }}</td>
            <td>{{ b.user_id }}</td>
            <td>{{ b.bill_phone }}</td>
            <td>{{ b.bill_address }}</td>
            <td>{{ b.bill_when }}</td>
            <td>{{ b.bill_paid }}</td>
            <td>${{ b.bill_total }}</td>
            <td>{{ availableStatus[b.bill_status] }}</td>
            <td>
              <button
                v-if="b.bill_status < 5"
                class="action-btn"
                @click="nextStatusBtn(b.bill_id)"
              >
                {{ availableStatus[b.bill_status + 1] }}
              </button>

              <button
                v-if="b.bill_status == 1"
                class="cancel-btn"
                @click="cancelBtn(b.bill_id)"
              >
                Cancel
              </button>

              <button
                v-else-if="b.bill_status == 5 && b.bill_paid == 'false'"
                class="paid-btn"
                @click="paidBtn(b.bill_id)"
              >
                Paid
              </button>

              <button
                v-else-if="b.bill_status == 5 && b.bill_paid == 'true'"
                class="action-btn"
                @click="nextStatusBtn(b.bill_id)"
              >
                {{ availableStatus[b.bill_status + 1] }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  background-color: #fff;
  height: 100vh;
  padding: 2rem 9%;
  font-size: 16px;
}

.project-list > tbody > tr > td {
  padding: 12px 8px;
}

.project-list > tbody > tr > td .avatar {
  width: 22px;
  border: 1px solid #ccc;
}

.table-responsive {
  margin-top: 8vh;
}

.action-btn,
.cancel-btn,
.paid-btn {
  width: 100px;
  height: 25px;
  color: white;
  text-transform: capitalize;
}

.action-btn {
  background-color: #0da9ef;
  margin-right: 10px;
}

.cancel-btn,
.paid-btn {
  background-color: red;
}

.action-btn:hover {
  background-color: #27ae60;
}
</style>
