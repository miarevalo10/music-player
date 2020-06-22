<template>
  <section id="login">
    <el-card class="box-card col2" :class="{ 'signup-form': !showLoginForm }">
      <el-form
        v-if="showLoginForm"
        @submit.prevent
        :model="loginForm"
        :rules="rulesLogin"
        ref="loginForm"
        id="form"
        :validate-on-rule-change="false"
        :hide-required-asterisk="true"
      >
        <h1>Login</h1>

        <el-form-item label="Email" prop="email">
          <el-input
            v-model.trim="loginForm.email"
            prefix-icon="el-icon-user"
            autocomplete="off"
            placeholder="you@email.com"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="******"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

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
      </el-form>
      <el-form
        v-if="!showLoginForm"
        @submit.prevent
        :model="signupForm"
        :rules="rulesSignup"
        ref="signupForm"
        :validate-on-rule-change="false"
        :hide-required-asterisk="true"
      >
        <h1>Create account</h1>

        <el-form-item label="Name" prop="name">
          <el-input
            v-model="signupForm.name"
            type="text"
            placeholder="Jon Doe"
            id="name"
          />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input
            v-model.trim="signupForm.email"
            prefix-icon="el-icon-user"
            autocomplete="off"
            placeholder="you@email.com"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model.trim="signupForm.password"
            type="password"
            placeholder="min 6 characters"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        <el-form-item label="Confirm password" prop="checkPass">
          <el-input
            v-model.trim="signupForm.checkPass"
            type="password"
            placeholder="min 6 characters"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <div class="bottom-options">
          <el-button type="text" @click="toggleForm">Back to Log In</el-button>
          <el-button
            type="primary"
            @click="signup"
            round
            :loading="performingRequest"
            >Sign Up</el-button
          >
        </div>
      </el-form>

      <transition name="fade">
        <div v-if="errorMsg !== ''" class="error-msg">
          <p>{{ errorMsg }}</p>
        </div>
      </transition>
    </el-card>
  </section>
</template>

<script>
const fb = require("../firebaseConfig.js");
export default {
  name: "Login",
  data() {
    var checkPasswordSize = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("Please input the password"));
      }
      setTimeout(() => {
        if (value.length < 7) {
          callback(new Error("Password size must be greater than 6"));
        } else {
          callback();
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (this.signupForm.checkPass !== "") {
          this.$refs.signupForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.signupForm.password) {
        callback(new Error("The passwords don't match!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        email: "",
        password: "",
        checkPass: ""
      },
      rulesLogin: {
        email: [
          {
            required: true,
            message: "Please input an email",
            trigger: "blur"
          }
        ],
        password: [{ validator: validatePass, trigger: "blur" }]
      },
      rulesSignup: {
        name: [
          {
            required: true,
            message: "Please input a name",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "Please input an email",
            trigger: "blur"
          }
        ],
        password: [
          { validator: validatePass, trigger: "blur" },
          { validator: checkPasswordSize, trigger: "blur" }
        ],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
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
      this.resetForm();
      this.showLoginForm = !this.showLoginForm;
    },
    resetForm() {
      this.showLoginForm
        ? this.$refs["loginForm"].clearValidate(Object.keys(this.loginForm))
        : this.$refs["signupForm"].clearValidate(Object.keys(this.signupForm));
      this.showLoginForm
        ? this.$refs["loginForm"].resetFields()
        : this.$refs["signupForm"].resetFields();
      // this.$refs["loginForm"].resetFields();
      this.loginForm = {
        email: "",
        password: ""
      };
      this.signupForm = {
        email: "",
        password: "",
        name: "",
        checkPass: ""
      };
    },
    login() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
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
        }
      });
    },
    async signup() {
      this.performingRequest = true;
      const user = await fb.auth.createUserWithEmailAndPassword(
        this.signupForm.email,
        this.signupForm.password
      );
      this.$store.commit("setCurrentUser", user.user);
      // create user obj

      fb.usersCollection
        .doc(user.user.uid)
        .set({
          name: this.signupForm.name,
          email: this.signupForm.email
        })
        .then(() => {
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
