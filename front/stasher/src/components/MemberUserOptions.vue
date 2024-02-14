<script>
import ExpensesTable from '../components/ExpensesTable.vue'
import MenuItem from '../components/MenuItem.vue'
import AddExpense from '../components/AddExpense.vue'
export default {
  name: 'memberUserOptions',
  data() {
         return {
            selectedRoute: '',
            expensesTable: 0,
            addExpense: 0
         }
   },
    components: {
        ExpensesTable,
         MenuItem,
         AddExpense
    },
    mounted() {
      this.selectedRoute = 'expensesTable'
   }
}
</script>


<template>
   <section>
      <div class="w-1/4 flex-wrap align-top inline-block px-10" >
         <MenuItem text="Show Expenses" :selected="selectedRoute == 'expensesTable'" @click="selectedRoute = 'expensesTable'; expensesTable++"></MenuItem>
         <MenuItem text="Add Expense" :selected="selectedRoute == 'addExpense'" @click="selectedRoute = 'addExpense'; ; addExpense++"></MenuItem>
      </div>
      Member
      <ExpensesTable class="w-3/4 flex-wrap align-top inline-block" :key="expensesTable" v-show="selectedRoute == 'expensesTable'"></ExpensesTable>
      <AddExpense class="w-3/4 flex-wrap align-top inline-block" :key="addExpense" v-show="selectedRoute == 'addExpense'"></AddExpense>
   </section>
</template>