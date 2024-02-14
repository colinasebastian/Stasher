<script>
import FormInput from "../components/FormInput.vue";
import axios from "axios";


export default {
  name: "userlogin",
  components: {
    FormInput,
    axios
  },
  data() {
    return {
      errors: [],
      email: "",
      password: "",
      url: import.meta.env.VITE_API_ENDPOINT
    };
  },
  mounted(){
  },
  methods: {
    formSubmit: function (e)  {
      this.email = e.target.email.value;
      this.password = e.target.password.value;
      e.preventDefault();
      let currentObj = this;
      if (this.checkForm()){
        this.axios
          .post(this.url + "/login", {
            "emailAddress": this.email,
            "password": this.password
          }, {
      crossDomain: true,
      withCredentials: true,
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin':"*",
          'Access-Control-Allow-Credentials':true
      }
    })
          .then(function (response) {
            console.log(response)
            if (response.data.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                currentObj.$emit('ready', 0);
                currentObj.$router.push('/userMenu').then(() => {
                });
            }
          })
          .catch(function (error) {
            currentObj.errors.push("Invalid email or password");
        })};
    },
    checkForm: function () {
      this.errors = [];

      if (!this.password) {
        this.errors.push("Password required.");
      }
      else if (this.password.length < 8) {
        this.errors.push("Password must be at least 8 characters.");
      }
      if (!this.email) {
        this.errors.push('Email required.');
      } else if (!this.validEmail(this.email)) {
        this.errors.push('Valid email required.');
      }
      if (!this.errors.length) {
        return true;
      }
    },
    validEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>

<template>
  <body class="w-full text-text bg-b text-slate-50">
    <h1
      class=" mt-10 w-1/3 py-4 mx-auto text-center font-bold text-2xl text-text text-slate-50 border-b-2 border-fg"
    >
      User Login
    </h1>
    <form class="flex flex-col w-1/3 gap-1 py-16 mx-auto my-0" @submit="formSubmit">
      <FormInput label="Email" placeholder="Your email..." name="email" v-model="email" type="email" error="Incorrect email"
      ></FormInput>
      <FormInput label="Password" placeholder="Your password..." name="password" v-model="password" type="password"
      ></FormInput>
      <input label="Login" name="LOGIN" value="Sign in" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
      />
      <p v-if="errors.length" class="mt-4 text-rose-900">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
    </form>
  </body>
</template>
