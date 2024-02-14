  <script>
  import logo from "../assets/logo.png"
  export default {
    name: 'customHeader',
    data: function () {
        return {
            loggedIn: false,
            logo: logo,
            redirect: ""
        }
    },
    methods: {
        logout() {
            let currentObj = this;
            localStorage.removeItem('user');
            currentObj.loggedIn = false;
            currentObj.$router.push('/');
        }
    },
    mounted() {
        this.loggedIn = localStorage.getItem('user') != null;
        this.redirect = this.loggedIn ?'/userMenu' : '/';
    }
  }
  </script>

  <template>
    <header class="flex align-items justify-between px-16 py-4 border-b-[1px] border-fg font-medium text-sm">
      <router-link :to="redirect" class="text-primary text-rose-700 font-bold text-base"><img :src="logo" :alt="logo" :title="logo" width="40" class="mr-2 inline"/> Stasher</router-link>
      <nav class="flex gap-6 items-center">
        <router-link to="/adminUserReg" v-show="!loggedIn" class="bg-rose-700 hover:bg-rose-900 text-white font-bold py-2 px-4 inline-block rounded w-100 text-center">
          Register
        </router-link>
      <router-link to="/userLogin" v-show="!loggedIn" class="font-bold transition-colors cursor-pointer hover:text-primary inline-block align-baseline">
          Sign in
      </router-link>
      <button label="Sign out" v-show="loggedIn" @click="logout" class="bg-rose-700 hover:bg-rose-900 text-white font-bold py-2 px-4 inline-block rounded w-100 text-center">
          Sign out
          </button>
        <router-link to="/about" class="font-bold transition-colors cursor-pointer hover:text-primary inline-block align-baseline">About</router-link>
        <router-link to="/technologies" class="font-bold transition-colors cursor-pointer hover:text-primary inline-block align-baseline"
          >Technologies</router-link
        >
      </nav>
    </header>
  </template>
