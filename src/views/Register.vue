<script setup>
import AxiosInstance from "../axios";
import { ref } from "vue";
import { useStore } from "../stores/store.js";
const { getUser } = useStore();
import { useRouter } from "vue-router";

const router = useRouter();
const matchUser = ref(undefined);
const registerObj = ref({
  name: "",
  email: "",
  pass: "",
  confirm: "",
  phone: "",
  birth: "",
  gender: "",
});
const errorObj = ref({
  nameErr: [],
  emailErr: [],
  passErr: [],
  confirmErr: [],
  phoneErr: [],
  birthErr: [],
  genderErr: [],
});

function refresh() {
  if (getUser) {
    router.push({ name: "home" });
  }
}
refresh();

function scrollToTop() {
  window.scrollTo(0, 0);
}
function availableTime() {
  const now = new Date();
  let day = ("0" + now.getDate()).slice(-2);
  let currentMonth = ("0" + (now.getMonth() + 1)).slice(-2);
  let minRange = now.getFullYear() - 150 + "-" + currentMonth + "-" + day;
  let maxRange = now.getFullYear() + "-" + currentMonth + "-" + day;
  document.getElementById("uBirth").setAttribute("min", minRange);
  document.getElementById("uBirth").setAttribute("max", maxRange);
}
function resetCheckErr() {
  errorObj.value.nameErr = [];
  errorObj.value.emailErr = [];
  errorObj.value.passErr = [];
  errorObj.value.confirmErr = [];
  errorObj.value.phoneErr = [];
  errorObj.value.birthErr = [];
  errorObj.value.genderErr = [];
}
function checkEmptyErr() {
  for (let typeErr in errorObj.value) {
    if (errorObj.value[typeErr].length != 0) {
      return false;
    }
  }
  return true;
}
function checkForm() {
  resetCheckErr();
  // Name validate
  if (!registerObj.value.name) {
    errorObj.value.nameErr.push("Entering a name is required");
  } else {
    if (!/^[A-Za-z]+$/.test(registerObj.value.name.replace(/\s/g, ""))) {
      errorObj.value.nameErr.push("A name can only contain letters");
    }
  }
  // Email validate
  if (!registerObj.value.email) {
    errorObj.value.emailErr.push("Entering a email is required");
  } else {
    if (
      !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(registerObj.value.email)
    ) {
      errorObj.value.emailErr.push("Email must be valid");
    }
  }
  // Pass validate
  if (!registerObj.value.pass) {
    errorObj.value.passErr.push("Password is required");
  } else {
    if (!/[!@#$%^&*]/.test(registerObj.value.pass)) {
      errorObj.value.passErr.push(
        "Password must contain at least 1 special character"
      );
    }
    if (registerObj.value.pass.length < 8) {
      errorObj.value.passErr.push(
        "Password must be more than or equal 8 characters"
      );
    }
  }
  // Confirm Pass validate
  if (!registerObj.value.confirm) {
    errorObj.value.confirmErr.push("Confirm password is required");
  } else {
    if (registerObj.value.pass !== registerObj.value.confirm) {
      errorObj.value.confirmErr.push(
        "Confirm password must match with the password"
      );
    }
  }
  // Phone validate
  if (!registerObj.value.phone) {
    errorObj.value.phoneErr.push("Entering phone number is required");
  } else {
    if (!/^0[567]/.test(registerObj.value.phone)) {
      errorObj.value.phoneErr.push(
        "Phone numbers must start with 05, 06, or 07"
      );
    }
    if (registerObj.value.phone.length != 10) {
      errorObj.value.phoneErr.push("Phone numbers must have exactly 10 digits");
    }
  }
  // Birth validate
  if (!registerObj.value.birth) {
    errorObj.value.birthErr.push("Entering birthday is required");
  } else {
    let minRange = document.getElementById("uBirth").getAttribute("min");
    let maxRange = document.getElementById("uBirth").getAttribute("max");
    let dateMin = new Date(minRange);
    let dateMax = new Date(maxRange);
    let dateInput = new Date(registerObj.value.birth);
    if (dateInput === "Invalid Date") {
      errorObj.value.birthErr.push("Invalid date input");
    }
    if (
      dateInput.getTime() < dateMin.getTime() ||
      dateInput.getTime() > dateMax.getTime()
    ) {
      errorObj.value.birthErr.push(
        "Available birthday range is from pass 150 years to now"
      );
    }
  }
  // Gender validate
  if (!registerObj.value.gender) {
    errorObj.value.genderErr.push("Please select a gender");
  }
}

async function getMatchUser(email) {
  let res = await AxiosInstance.get("/users/" + email);
  matchUser.value = res.data;
}
async function handleSubmit() {
  checkForm();
  if (checkEmptyErr()) {
    await getMatchUser(registerObj.value.email);
    if (matchUser.value) {
      errorObj.value.emailErr.push("Account already exist");
    } else {
      let data = {
        user_name: registerObj.value.name,
        user_email: registerObj.value.email,
        user_phone: registerObj.value.phone,
        user_password: registerObj.value.pass,
        user_birth: registerObj.value.birth,
        user_gender: registerObj.value.gender,
        // user_confirm: registerObj.value.confirm,
      };
      await AxiosInstance.post("/users/", data);
      router.push("/login");
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-form-container">
      <form
        id="registerForm"
        @submit.prevent="handleSubmit"
        novalidate
        autocomplete="off"
      >
        <h3>Create your account</h3>
        <div class="form-group">
          <label for="uName">Enter your name: </label>
          <input
            type="text"
            name="uName"
            placeholder="your full name"
            id="uName"
            class="form-control"
            v-model="registerObj.name"
          />
          <p class="error-mess" v-if="errorObj.nameErr.length > 0">
            {{ errorObj.nameErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="uEmail">Enter your email: </label>
          <input
            type="email"
            name="uEmail"
            placeholder="example@gmail.com"
            id="uEmail"
            class="form-control"
            v-model="registerObj.email"
          />
          <p class="error-mess" v-if="errorObj.emailErr.length > 0">
            {{ errorObj.emailErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="uPass">Enter your password: </label>
          <input
            type="password"
            name="uPass"
            placeholder="enter your password"
            id="uPass"
            class="form-control"
            v-model="registerObj.pass"
          />
          <p class="error-mess" v-if="errorObj.passErr.length > 0">
            {{ errorObj.passErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="uPassConfirm">Check your password again: </label>
          <input
            type="password"
            name="uPassConfirm"
            placeholder="enter your password again"
            id="uPassConfirm"
            class="form-control"
            v-model="registerObj.confirm"
          />
          <p class="error-mess" v-if="errorObj.confirmErr.length > 0">
            {{ errorObj.confirmErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="uPhone">Enter your phone number: </label>
          <input
            type="tel"
            name="uPhone"
            placeholder="enter your phone number"
            id="uPhone"
            class="form-control"
            v-model="registerObj.phone"
          />
          <p class="error-mess" v-if="errorObj.phoneErr.length > 0">
            {{ errorObj.phoneErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="uBirth">Enter your birthday: </label>
          <input
            type="date"
            name="uBirth"
            id="uBirth"
            class="form-control"
            @click="availableTime()"
            v-model="registerObj.birth"
          />
          <p class="error-mess" v-if="errorObj.birthErr.length > 0">
            {{ errorObj.birthErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="">Select your gender: </label>
          <div class="form-group">
            <input
              type="radio"
              name="gender"
              value="male"
              id="genderMale"
              v-model="registerObj.gender"
            /><span>Male</span>
            <input
              type="radio"
              name="gender"
              value="female"
              id="genderFemale"
              v-model="registerObj.gender"
            /><span>Female</span>
          </div>
          <p class="error-mess" v-if="errorObj.genderErr.length > 0">
            {{ errorObj.genderErr[0] }}
          </p>
        </div>

        <div class="form-group">
          <input type="submit" value="join us" class="btn" />
          <p>
            have an account?
            <router-link @click="scrollToTop()" to="/login">login</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  padding: 2rem 9%;
}

.register-container .register-form-container {
  background: #fff;
}

.register-container .register-form-container form {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
  max-width: 70rem;
  width: 100%;
  box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.05);
  border: 0.1rem solid rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 0.5rem;
  animation: fadeUp 0.4s linear;
}

.register-container .register-form-container form h3 {
  padding-bottom: 1rem;
  font-size: 2rem;
  text-transform: uppercase;
  color: #130f40;
  margin: 0;
}

.register-container .register-form-container form .form-control {
  margin: 0.7rem 0;
  border-radius: 0.5rem;
  background: #f7f7f7;
  padding: 2rem 1.2rem;
  font-size: 1.6rem;
  color: #130f40;
  text-transform: none;
  width: 100%;
  border: none;
}

.register-container .register-form-container form label {
  font-size: 2rem;
  margin: 0;
  padding: 0;
}

.register-container .register-form-container form span {
  font-size: 18px;
  padding-left: 5px;
  padding-right: 40px;
}

.register-container .register-form-container form .btn {
  margin: 1rem 0;
  width: 100%;
  text-align: center;
}

.register-container .register-form-container form p {
  padding-top: 1rem;
  font-size: 1.5rem;
  color: #666;
  margin: 0;
}

.register-container .register-form-container form p a {
  color: #27ae60;
}

.register-container .register-form-container form p a:hover {
  color: #130f40;
  text-decoration: underline;
}

.register-container .register-form-container form .form-group {
  margin: 0;
}

.register-container .register-form-container form .form-group .error-mess {
  font-size: 1.5rem;
  position: relative;
  color: rgb(243, 47, 47);
  margin: 0;
  padding: 0;
}
</style>
