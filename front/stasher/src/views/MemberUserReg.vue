<script>
import FormInput from "../components/FormInput.vue";
import axios from "axios";

export default {
  name: "memberUserReg",
  components: {
    FormInput,
    axios
  },
  data() {
    return {
      errors: [],
      email: "",
      password: "",
      name: "",
      url: import.meta.env.VITE_API_ENDPOINT,
      familyKey: ""
    };
  },
  methods: {
    formSubmit: function (e)  {
      e.preventDefault();
      let currentObj = this;
      this.email = e.target.email.value;
      this.password = e.target.password.value;
      this.name = e.target.name.value;
      this.familyKey = currentObj.$route.query.key
      if (this.checkForm()){
        this.axios
          .post(this.url + "/user?key=" + this.familyKey, {
            "name": this.name,
            "emailAddress": this.email,
            "password": this.password,
            "role": "member",
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
            currentObj.$router.push('/userLogin');
          })
          .catch(function (error) {
            console.log(error);
            currentObj.errors.push(error.response.data.message);
        })};
    },
    checkForm: function () {
      this.errors = [];

      if (!this.password) {
        this.errors.push("Password required.");
      }
      if (!this.name) {
        this.errors.push("Name required.");
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
  },
  mounted(){
    localStorage.removeItem('user');
  }
};
</script>

<template>
  <body class="w-full text-text bg-b text-slate-50 ">
    <h1 class='mt-10 w-1/3 py-4  mx-auto  text-center font-bold text-2xl text-text text-slate-50 border-b-2 border-fg'>Member User Registration</h1>
  <form class="flex flex-col w-1/3 gap-1 py-10 mx-auto my-0 " @submit="formSubmit">
    <FormInput label="Name" placeholder="Your full name..." v-model="name" name="name" type="name" ></FormInput>
    <FormInput label="Email" placeholder="Your email..." name="email"  v-model="email" type="email" error="Incorrect email"></FormInput>
    <FormInput label="Password" placeholder="Your password..."  v-model="password" name="password" type="password"></FormInput>
    
    <input
        label="Register"
        name="Register"
        value="Register"
        type="submit"
        class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
      />
      <p v-if="errors.length" class="mt-4 text-rose-800">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
  </form>
  </body>
</template>
