<template>
  <div id="login">
    <section>
      <div>
        <el-card
          class="box-card col2"
          :class="{ 'signup-form': !showLoginForm }"
        >
          <form v-if="showLoginForm" @submit.prevent>
            <h1>Music player login</h1>

            <label for="email1">Email</label>
            <el-input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="you@email.com"
              id="email1"
            />

            <label for="password1">Password</label>
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
            />
            <div class="bottom-options">
              <el-button type="text" @click="toggleForm"
                >Create an Account</el-button
              >
              <el-button
                type="primary"
                round
                @click="login"
                :loading="performingRequest"
                >Log In</el-button
              >
            </div>
          </form>
          <form v-if="!showLoginForm" @submit.prevent>
            <h1>Create account</h1>

            <label for="name">Name</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="Jon Doe"
              id="name"
            />

            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="you@email.com"
              id="email2"
            />

            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 characters"
              id="password2"
            />
            <div class="bottom-options">
              <el-button type="text" @click="toggleForm"
                >Back to Log In</el-button
              >

              <el-button
                type="primary"
                @click="signup"
                round
                :loading="performingRequest"
                >Sign Up</el-button
              >
            </div>
          </form>

          <transition name="fade">
            <div v-if="errorMsg !== ''" class="error-msg">
              <p>{{ errorMsg }}</p>
            </div>
          </transition>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        email: "",
        password: ""
      },
      showLoginForm: true,
      passwordResetSuccess: false,
      performingRequest: false,
      errorMsg: ""
    };
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
    },
    login() {
      this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          this.$store.dispatch("fetchUserProfile");
          this.performingRequest = false;
          this.$router.push("/songs");
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    signup() {
      this.performingRequest = true;
      fb.auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          this.$store.commit("setCurrentUser", user.user);
          // create user obj
          console.log("user on sign up", user, this.signupForm);
          fb.usersCollection
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name,
              email: this.signupForm.email
            })
            .then(() => {
              console.log("LLEGA AQUI", user);
              this.$store.dispatch("fetchUserProfile");
              this.performingRequest = false;
              this.$router.push("/songs");
            })
            .catch(err => {
              console.log(err);
              this.performingRequest = false;
              this.errorMsg = err.message;
            });
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    },
    resetPassword() {
      this.performingRequest = true;
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>
