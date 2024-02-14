    <script>
    import FormInput from "../components/FormInput.vue";
    import axios from "axios";

    export default {
    name: 'addExpense',
    data: function () {
        return {
            amount: "",
            producedDate: "",
            description: "",
            category: "",
            errors: [],
            categories: [],
            url: import.meta.env.VITE_API_ENDPOINT,
            message: ''
        }
    },
    components: {
        FormInput,
        axios
    },
        methods: {
            formSubmit: function (e)  {
            this.amount = e.target.amount.value;
            this.description = e.target.description.value;
            this.producedDate = e.target.producedDate.value;
            this.category = e.target.category.value;
            e.preventDefault();
            let currentObj = this;
            currentObj.errors = [];
            currentObj.message = '';
            if (this.checkForm()){
                this.axios
                .post(this.url + "/expenses", {
                    "amount": this.amount,
                    "description": this.description,
                    "producedDate": new Date(this.producedDate).toISOString().slice(0, 19),
                    "category": { "name": this.category }
                }, {
                crossDomain: true,
                withCredentials: true,
                headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                "Access-Control-Allow-Headers": "Content-Type, Accept",
                'Access-Control-Allow-Credentials':true }
            })
                .then(function (response) {
                    console.log(response)
                    currentObj.message = "Expense added successfully";
                })
                .catch(function (error) {
                    currentObj.errors.push(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                })};
            },
            checkForm: function () {
                if (!this.amount) {
                    this.errors.push('Amount required.');
                }
                if (!this.description) {
                    this.errors.push('Description required.');
                }
                if (!this.producedDate) {
                    this.errors.push('Produced date required.');
                }
                if (!this.category) {
                    this.errors.push('Category required.');
                }
                if (!this.errors.length) {
                    return true;
                }
            },
            fillOptions: function(){
                let currentObj = this;
                this.axios
                .get(this.url + "/categories", {
                crossDomain: true,
                withCredentials: true,
                headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                "Access-Control-Allow-Headers": "Content-Type, Accept",
                'Access-Control-Allow-Credentials':true }
            })
                .then(function (response) {
                    console.log(response)
                    currentObj.categories = response.data.data.categories;
                })
                .catch(function (error) {
                    currentObj.errors.push(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                })
                this.producedDate = new Date().toISOString().slice(0, 10);
            }
        },
        mounted() {
            this.fillOptions();
        }
    }
    </script>

    <template>
    <section class="mb-10">
    <div class="flex-wrap w-3/4 mx-auto py-2 mt-2">
        <form class="flex flex-col w-2/3 gap-1 mx-auto my-0" @submit="formSubmit">
        <h1
        class=" mt-2 mx-auto text-center font-bold text-xl text-text text-slate-50 my-2 border-b-2 border-fg"
        >
        Add Expense
        </h1>
        <FormInput label="Amount" placeholder="Amount of expense..." name="amount" v-model="amount" type="number" error="Incorrect amount"></FormInput>
        <FormInput label="Description" placeholder="Description of expense..." name="description" v-model="description" type="text" error="Incorrect description"></FormInput>
        <FormInput label="Produced date" placeholder="Produced date of expense..." name="producedDate" :value="producedDate" type="date" error="Incorrect produced date"></FormInput>
        <span class="block text-sm font-bold mt-4">Select a category :</span>
        <select class="mt-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 
            invalid:border-pink-500 invalid:text-pink-600 text-gray-500 placeholder:text-gray-300
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500" name="category" v-model="category">
            <option disabled value="">-- Please select one --</option>
            <option v-for="category in categories" >{{ category.name }}</option>
        </select>
        <input label="send" name="send" value="Add Expense" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
        />
        <p v-if="errors.length" class="mt-4 text-rose-900">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p v-if="message.length" class="mt-4 text-white-900">
        <b>{{message}}!</b>
        </p>
        </form>
    </div>
    </section>
    </template>