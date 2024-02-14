   <script>
   import ExpensesTable from '../components/ExpensesTable.vue'
   import InviteMember from '../components/InviteMember.vue'
   import MenuItem from '../components/MenuItem.vue'
   import AccessApiKey from '../components/AccessApiKey.vue'
   import AddCategory from '../components/AddCategory.vue'
   import AddExpense from '../components/AddExpense.vue'
   import CategoriesTable from '../components/CategoriesTable.vue'

   export default {
   name: 'adminUserOptions',
   data() {
         return {
            selectedRoute: '',
            expensesTable: 0,
            inviteMember: 0,
            accessAPIKey: 0,
            addCategory: 0,
            addExpense: 0,
            categoriesTable: 0
         }
   },
   components: {
      ExpensesTable,
      InviteMember,
      MenuItem,
      AccessApiKey,
      AddCategory,
      AddExpense,
      CategoriesTable
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
         <MenuItem text="Add Expense" :selected="selectedRoute == 'addExpense'" @click="selectedRoute = 'addExpense'; addExpense++"></MenuItem>
         <MenuItem text="Show Categories" :selected="selectedRoute == 'categoriesTable'" @click="selectedRoute = 'categoriesTable'; categoriesTable++"></MenuItem>
         <MenuItem text="Add Category" :selected="selectedRoute == 'addCategory'" @click="selectedRoute = 'addCategory'; addCategory++"></MenuItem>
         <MenuItem text="Invite Member" :selected="selectedRoute == 'inviteMember'" @click="selectedRoute = 'inviteMember'; inviteMember++"></MenuItem>
         <MenuItem text="Access API Key" :selected="selectedRoute == 'accessAPIKey'" @click="selectedRoute = 'accessAPIKey'; accessAPIKey++"></MenuItem>
      </div>
      <ExpensesTable class="w-3/4 flex-wrap align-top inline-block" :key="expensesTable" v-show="selectedRoute == 'expensesTable'"></ExpensesTable>
      <InviteMember class="w-3/4 flex-wrap align-top inline-block" :key="inviteMember" v-show="selectedRoute == 'inviteMember'"></InviteMember> 
      <AccessApiKey class="w-3/4 flex-wrap align-top inline-block" :key="accessAPIKey" v-show="selectedRoute == 'accessAPIKey'"></AccessApiKey>
      <AddCategory class="w-3/4 flex-wrap align-top inline-block" :key="addCategory" v-show="selectedRoute == 'addCategory'"></AddCategory>
      <AddExpense class="w-3/4 flex-wrap align-top inline-block" :key="addExpense" v-show="selectedRoute == 'addExpense'"></AddExpense>
      <CategoriesTable class="w-3/4 flex-wrap align-top inline-block" :key="categoriesTable" v-show="selectedRoute == 'categoriesTable'"></CategoriesTable>
   </section>
   </template>