<template>
  <div class="login-container">
    <div class="title">N64 Stars</div>
    <form>
      <div v-if="!wrongPassword" class="login-password">Passwort?</div>
      <div v-if="wrongPassword" ref="wrong-password" :class="wrongPasswordClass">Versuch's nochmal</div>
      <input class="form-input" type="password" v-model="password" />
      <br />
      <br />
      <button class="button success" @click="onSubmit">Senden</button>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import router from "../router";

const API_URL = "/api/";

export default {
  name: "Login",

  data() {
    return {
      wrongPassword: false,
      password: "",
      wrongPasswordClass: "login-password wrong-password shake",
    };
  },

  methods: {
    onSubmit(event) {
      event.preventDefault();

      this.wrongPasswordClass = "login-password wrong-password";

      axios
        .post(API_URL + "login", { password: this.password })
        .then((response) => {
          console.debug("submitted PW", { response });
          if (response.data && response.data.token) {
            localStorage.setItem("n64-jwt", response.data.token);
            router.push({ name: "Home" });
          } else {
            console.error("No token.");
          }
        })
        .catch((error) => {
          if (error && error.response && error.response.status) {
            this.wrongPasswordClass = "login-password wrong-password shake";
            this.wrongPassword = true;
            this.password = "";
          }
        });
    },
  },
};
</script>
<style lang=""></style>
