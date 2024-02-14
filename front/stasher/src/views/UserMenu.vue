<script>
import MemberUserOptions from '../components/MemberUserOptions.vue'
import AdminUserOptions from '../components/AdminUserOptions.vue'
import ExpensesTable from '../components/ExpensesTable.vue'
import axios from "axios";


export default {
  name: "userMenu",
  components: {
    axios,
    MemberUserOptions,
    AdminUserOptions,
    ExpensesTable
  },
  data() {
    return {
      url: import.meta.env.VITE_API_ENDPOINT,
      user: "",
      isAdmin: true
    };
  },
  methods: {
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.isAdmin = user.role === "administrator"
    }
  }
};
</script>

<template>
  <div class="w-full text-text bg-b text-slate-50 pt-12">
    <MemberUserOptions v-show="!isAdmin" :key="isAdmin" ></MemberUserOptions>
    <AdminUserOptions v-show="isAdmin" :key="isAdmin" ></AdminUserOptions>
  </div>
</template>
