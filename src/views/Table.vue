<script setup>
import AxiosInstance from "../axios";
import VueBasicAlert from "vue-basic-alert";
import { ref } from "vue";

const alert = ref(null);
const orderObj = ref({
  name: "",
  phone: "",
  people: "",
  tables: "",
  card: "",
  when: "",
  note: "",
});
const errorObj = ref({
  nameErr: [],
  phoneErr: [],
  peopleErr: [],
  tablesErr: [],
  cardErr: [],
  whenErr: [],
});

function availableTime() {
  const now = new Date();
  let day = ("0" + now.getDate()).slice(-2);
  let currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);
  let maxMonth = ("0" + (now.getMonth() + 3)).slice(-2);
  let hour = ("0" + now.getHours()).slice(-2);
  let min = ("0" + now.getMinutes()).slice(-2);
  let minRange =
    now.getFullYear() + "-" + currentMonth + "-" + day + "T" + hour + ":" + min;
  let maxRange =
    now.getFullYear() + "-" + maxMonth + "-" + day + "T" + hour + ":" + min;
  document.getElementById("oWhen").setAttribute("min", minRange);
  document.getElementById("oWhen").setAttribute("max", maxRange);
}
function resetCheckErr() {
  errorObj.value.nameErr = [];
  errorObj.value.phoneErr = [];
  errorObj.value.peopleErr = [];
  errorObj.value.tablesErr = [];
  errorObj.value.cardErr = [];
  errorObj.value.whenErr = [];
}
function checkEmptyErr() {
  for (var typeErr in errorObj.value) {
    if (errorObj.value[typeErr].length != 0) {
      return false;
    }
  }
  return true;
}
function checkForm() {
  resetCheckErr();
  // Name validate
  if (!orderObj.value.name) {
    errorObj.value.nameErr.push("Entering a name is required");
  } else {
    if (!/^[A-Za-z]+$/.test(orderObj.value.name.replace(/\s/g, ""))) {
      errorObj.value.nameErr.push("A name can only contain letters");
    }
  }
  // Phone validate
  if (!orderObj.value.phone) {
    errorObj.value.phoneErr.push("Entering phone number is required");
  } else {
    if (!orderObj.value.phone.startsWith("+212")) {
      errorObj.value.phoneErr.push(
        "Phone numbers must start with +212 example +212-xxxxxxxxx"
      );
    }
    if (!/[0-9]{10}/.test(orderObj.value.phone)) {
      errorObj.value.phoneErr.push("Phone numbers can only contain numbers");
    }
  }
  if (!orderObj.value.people) {
    errorObj.value.peopleErr.push("Entering number of people is required");
  } else {
    if (parseInt(orderObj.value.people) > 100) {
      errorObj.value.peopleErr.push(
        "Each store can only serve 100 people at a time"
      );
    }
    if (parseInt(orderObj.value.people) < 1) {
      errorObj.value.peopleErr.push(
        "Number of people must be greater than or equal to 1"
      );
    }
  }
  if (!orderObj.value.tables) {
    errorObj.value.tablesErr.push("Entering number of tables is required");
  } else {
    if (parseInt(orderObj.value.tables) > 50) {
      errorObj.value.tablesErr.push(
        "Each store can only have maximum 50 tables"
      );
    }
    if (parseInt(orderObj.value.tables) < 1) {
      errorObj.value.tablesErr.push(
        "Number of tables must be greater than or equal to 1"
      );
    }
    if (parseInt(orderObj.value.people) < parseInt(orderObj.value.tables)) {
      errorObj.value.tablesErr.push(
        "The number of tables must be less than the number of people"
      );
    }
  }
  if (orderObj.value.card) {
    if (!/[0-9]{10}/.test(orderObj.value.card)) {
      errorObj.value.cardErr.push("Card numbers can only contain numbers");
    }

    if (orderObj.value.card.length != 10) {
      errorObj.value.cardErr.push("Card number must have exactly 10 digits");
    }
  }
  if (!orderObj.value.when) {
    errorObj.value.whenErr.push("Entering when to serve is required");
  } else {
    let minRange = document.getElementById("oWhen").getAttribute("min");
    let maxRange = document.getElementById("oWhen").getAttribute("max");
    let dateMin = new Date(minRange);
    let dateMax = new Date(maxRange);
    let dateInput = new Date(orderObj.value.when);
    if (dateInput === "Invalid Date") {
      errorObj.value.whenErr.push("Invalid date input");
    }
    if (
      dateInput.getTime() < dateMin.getTime() ||
      dateInput.getTime() > dateMax.getTime()
    ) {
      errorObj.value.whenErr.push(
        "Available reservation range is from now to next two months"
      );
    }
    if (dateInput.getHours() < 7 || dateInput.getHours() > 22) {
      errorObj.value.whenErr.push(
        "Store open from 7:00 AM to 10:00 PM everyday"
      );
    }
  }
}
async function handleSubmit(e) {
  checkForm();
  if (checkEmptyErr()) {
    let data = {
      book_name: orderObj.value.name,
      book_phone: parseInt(orderObj.value.phone),
      book_people: parseInt(orderObj.value.people),
      book_tables: parseInt(orderObj.value.tables),
      membership_card: parseInt(orderObj.value.card),
      book_when: orderObj.value.when,
      book_note: orderObj.value.note,
    };
    await AxiosInstance.post("/booking", data);
    alert.value.showAlert(
      "success",
      "Thank you! We will call you soon to confirm your order",
      "Booking Successfully !"
    );
    document.getElementById("bookTableForm").reset();
  }
}
</script>

<template>
  <vue-basic-alert :duration="300" :closeIn="2000" ref="alert" />
  <section class="order-section">
    <div class="heading">
      <span>book a table</span>
      <h3>enjoy your moment</h3>
    </div>

    <div class="icons-container">
      <div class="icons">
        <img src="../assets/images/icon-1.png" alt="" />
        <h3>7:00am to 10:00pm</h3>
      </div>

      <div class="icons">
        <img src="../assets/images/icon-2.png" alt="" />
        <h3>+212 123 123 123</h3>
      </div>

      <div class="icons">
        <img src="../assets/images/icon-3.png" alt="" />
        <h3>Rue 2 Mars, Agadir 80000</h3>
      </div>
    </div>

    <!-- booking form -->
    <form
      id="bookTableForm"
      @submit.prevent="handleSubmit"
      novalidate
      autocomplete="off"
    >
      <div class="row">
        <div class="input-box">
          <label for="uName">your name</label>
          <input type="text" name="uName" id="uName" v-model="orderObj.name" />
          <p v-if="errorObj.nameErr.length > 0">{{ errorObj.nameErr[0] }}</p>
        </div>
        <div class="input-box">
          <label for="uPhone">your phone number</label>
          <input
            type="text"
            name="uPhone"
            id="uPhone"
            v-model="orderObj.phone"
          />
          <p v-if="errorObj.phoneErr.length > 0">{{ errorObj.phoneErr[0] }}</p>
        </div>
      </div>

      <div class="row">
        <div class="input-box">
          <label for="oPeople">how many people</label>
          <input
            type="number"
            name="oPeople"
            id="oPeople"
            v-model="orderObj.people"
          />
          <p v-if="errorObj.peopleErr.length > 0">
            {{ errorObj.peopleErr[0] }}
          </p>
        </div>
        <div class="input-box">
          <label for="oTables">how many tables</label>
          <input
            type="number"
            name="oTables"
            id="oTables"
            v-model="orderObj.tables"
          />
          <p v-if="errorObj.tablesErr.length > 0">
            {{ errorObj.tablesErr[0] }}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="input-box">
          <label for="uCard">your membership card</label>
          <input type="text" name="uCard" id="uCard" v-model="orderObj.card" />
          <p v-if="errorObj.cardErr.length > 0">{{ errorObj.cardErr[0] }}</p>
        </div>
        <div class="input-box">
          <label for="oWhen">when</label>
          <input
            type="datetime-local"
            name="oWhen"
            id="oWhen"
            v-model="orderObj.when"
            @click="availableTime()"
          />
          <p v-if="errorObj.whenErr.length > 0">{{ errorObj.whenErr[0] }}</p>
        </div>
      </div>

      <div class="row">
        <div class="input-box">
          <label for="uMessage">note</label>
          <textarea
            placeholder="your message, do you want to decorate your table ?"
            name="uMessage"
            id="uMessage"
            cols="30"
            rows="10"
            v-model="orderObj.note"
          ></textarea>
        </div>
        <div class="input-box">
          <iframe
            class="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.7078258099014!2d-9.57847837450594!3d30.41603042473862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b7ff3526c747%3A0xe57ab6af210c7870!2sDar%20Tajine!5e0!3m2!1sen!2sma!4v1686314590974!5m2!1sen!2sma"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <input type="submit" value="Book Now" class="btn" />
    </form>
  </section>
</template>

<!-- <script>
import axios from "axios";
export default {
  name: "Table",

  data() {
    return {
      orderObj: {
        name: "",
        phone: "",
        people: "",
        tables: "",
        card: "",
        when: "",
        note: "",
      },
      errorObj: {
        nameErr: [],
        phoneErr: [],
        peopleErr: [],
        tablesErr: [],
        cardErr: [],
        whenErr: [],
      },
    };
  },

  methods: {
    availableTime: function () {
      var now = new Date();
      var day = ("0" + now.getDate()).slice(-2);
      var currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);
      var maxMonth = ("0" + (now.getMonth() + 3)).slice(-2);
      var hour = ("0" + now.getHours()).slice(-2);
      var min = ("0" + now.getMinutes()).slice(-2);
      var minRange =
        now.getFullYear() +
        "-" +
        currentMonth +
        "-" +
        day +
        "T" +
        hour +
        ":" +
        min;
      var maxRange =
        now.getFullYear() + "-" + maxMonth + "-" + day + "T" + hour + ":" + min;

      document.getElementById("oWhen").setAttribute("min", minRange);
      document.getElementById("oWhen").setAttribute("max", maxRange);
    },

    resetCheckErr: function () {
      this.errorObj.nameErr = [];
      this.errorObj.phoneErr = [];
      this.errorObj.peopleErr = [];
      this.errorObj.tablesErr = [];
      this.errorObj.cardErr = [];
      this.errorObj.whenErr = [];
    },

    checkEmptyErr: function () {
      for (var typeErr in this.errorObj) {
        if (this.errorObj[typeErr].length != 0) {
          return false;
        }
      }
      return true;
    },

    checkForm: function () {
      this.resetCheckErr();
      // Name validate
      if (!this.orderObj.name) {
        this.errorObj.nameErr.push("Entering a name is required");
      } else {
        if (!/^[A-Za-z]+$/.test(this.orderObj.name.replace(/\s/g, ""))) {
          this.errorObj.nameErr.push("A name can only contain letters");
        }
      }
      // Phone validate
      if (!this.orderObj.phone) {
        this.errorObj.phoneErr.push("Entering phone number is required");
      } else {
        if (!this.orderObj.phone.startsWith("84")) {
          this.errorObj.phoneErr.push("Phone numbers must start with 84");
        }
        if (!/[0-9]{10}/.test(this.orderObj.phone)) {
          this.errorObj.phoneErr.push("Phone numbers can only contain numbers");
        }
        if (this.orderObj.phone.length != 11) {
          this.errorObj.phoneErr.push(
            "Phone numbers must have exactly 11 digits"
          );
        }
      }
      if (!this.orderObj.people) {
        this.errorObj.peopleErr.push("Entering number of people is required");
      } else {
        if (parseInt(this.orderObj.people) > 100) {
          this.errorObj.peopleErr.push(
            "Each store can only serve 100 people at a time"
          );
        }
        if (parseInt(this.orderObj.people) < 1) {
          this.errorObj.peopleErr.push(
            "Number of people must be greater than or equal to 1"
          );
        }
      }
      if (!this.orderObj.tables) {
        this.errorObj.tablesErr.push("Entering number of tables is required");
      } else {
        if (parseInt(this.orderObj.tables) > 50) {
          this.errorObj.tablesErr.push(
            "Each store can only have maximum 50 tables"
          );
        }
        if (parseInt(this.orderObj.tables) < 1) {
          this.errorObj.tablesErr.push(
            "Number of tables must be greater than or equal to 1"
          );
        }
        if (parseInt(this.orderObj.people) < parseInt(this.orderObj.tables)) {
          this.errorObj.tablesErr.push(
            "The number of tables must be less than the number of people"
          );
        }
      }
      if (this.orderObj.card) {
        if (!/[0-9]{10}/.test(this.orderObj.card)) {
          this.errorObj.cardErr.push("Card numbers can only contain numbers");
        }

        if (this.orderObj.card.length != 10) {
          this.errorObj.cardErr.push("Card number must have exactly 10 digits");
        }
      }
      if (!this.orderObj.when) {
        this.errorObj.whenErr.push("Entering when to serve is required");
      } else {
        let minRange = document.getElementById("oWhen").getAttribute("min");
        let maxRange = document.getElementById("oWhen").getAttribute("max");
        let dateMin = new Date(minRange);
        let dateMax = new Date(maxRange);
        let dateInput = new Date(this.orderObj.when);
        if (dateInput === "Invalid Date") {
          this.errorObj.whenErr.push("Invalid date input");
        }
        if (
          dateInput.getTime() < dateMin.getTime() ||
          dateInput.getTime() > dateMax.getTime()
        ) {
          this.errorObj.whenErr.push(
            "Available reservation range is from now to next two months"
          );
        }
        if (dateInput.getHours() < 7 || dateInput.getHours() > 22) {
          this.errorObj.whenErr.push(
            "Store open from 7:00 AM to 10:00 PM everyday"
          );
        }
      }
    },

    async handleSubmit(e) {
      this.checkForm();
      if (!this.checkEmptyErr()) {
        e.preventDefault();
      } else {
        e.preventDefault();
        let data = {
          book_name: this.orderObj.name,
          book_phone: parseInt(this.orderObj.phone),
          book_people: parseInt(this.orderObj.people),
          book_tables: parseInt(this.orderObj.tables),
          user_id: parseInt(this.orderObj.card),
          book_when: this.orderObj.when,
          book_note: this.orderObj.note,
        };
        await axios.post("/booking", data);
        this.$refs.alert.showAlert(
          "success",
          "Thank you! We will call you soon to confirm your order",
          "Booking Successfully !"
        );
        document.getElementById("bookTableForm").reset();
      }
    },
  },

  components: {
    VueBasicAlert,
  },
};
</script> -->

<style scoped>
.order-section {
  padding: 2rem 9%;
}

.order-section .icons-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.order-section .icons-container .icons {
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  background: #f7f7f7;
}

.order-section .icons-container .icons img {
  height: 10rem;
}

.order-section .icons-container .icons h3 {
  font-size: 2rem;
  color: #130f40;
  margin-top: 0.5rem;
}

.order-section form {
  background: #f7f7f7;
  padding: 2rem;
  border-radius: 0.5rem;
}

.order-section form .row {
  justify-content: space-between;
}

.order-section form .row .input-box {
  width: 49%;
  padding: 1.8rem 0;
}

.order-section form .row label {
  font-size: 1.7rem;
  color: #666;
}

.order-section form .row p {
  font-size: 1.5rem;
  position: absolute;
  color: rgb(243, 47, 47);
  margin: 0;
  padding-top: 5px;
}

.order-section form .row input,
.order-section form .row textarea {
  width: 100%;
  margin-top: 0.5rem;
  padding: 1rem 1.2rem;
  width: 100%;
  border-radius: 0.5rem;
  font-size: 1.6rem;
  text-transform: none;
  color: #130f40;
}

.order-section form .row textarea {
  height: 20rem;
  resize: none;
}

.order-section form .row .map {
  height: 100%;
  width: 100%;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .order form .row .input-box {
    width: 100%;
  }

  .order-section form .row {
    display: block;
    max-width: 100%;
    width: 100%;
    margin: 0;
  }

  .order-section form .row .input-box {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .order-section .icons-container {
    grid-template-columns: repeat(auto-fit, minmax(30rem, 1fr));
  }
}
</style>
