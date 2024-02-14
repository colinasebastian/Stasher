    <script>
    import FormInput from "../components/FormInput.vue";
    import axios from "axios";

    export default {
    name: 'addCategory',
    data: function () {
        return {
            name: "",
            description: "",
            image: "",
            limitPerMonthExpense: 0,
            errors: [],
            url: import.meta.env.VITE_API_ENDPOINT,
            message: '',
            files: [],
            photo: {} 
        }
    },
    components: {
        FormInput,
        axios
    },
    mounted(){
    },
        methods: {
            updatePhoto (files) {
                if (!files.length) return;
                this.photo = {
                    data: files[0]
                };
            },  
            formSubmit: function (e)  {
            let currentObj = this;
            const photoFormData = new FormData();
            photoFormData.append("image", currentObj.photo.data);
            photoFormData.append("description", e.target.description.value);
            photoFormData.append("name", e.target.name.value);
            photoFormData.append("limitPerMonthExpense", e.target.limitPerMonthExpense.value);
            e.preventDefault();
            currentObj.errors = [];
            if (this.checkForm(e)){
                this.axios
                .post(this.url + "/categories", photoFormData, {
                    crossDomain: true,
                    withCredentials: true,
                    headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                            'Content-Type': 'multipart/form-data' }
                    })
                .then(function (response) {
                    currentObj.message = "Category added successfully";
                })
                .catch(function (error) {
                    currentObj.errors.push(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                })};
            },
            checkForm: function (e) {
                if (!this.photo.data) {
                    this.errors.push("Please select a photo.");
                }
                if (!e.target.name.value) {
                    this.errors.push("Please enter a name.");
                }
                if (!e.target.description.value) {
                    this.errors.push("Please enter a description.");
                }
                if (!e.target.limitPerMonthExpense.value) {
                    this.errors.push("Please enter a limit per month expense.");
                }
                return true;
            
            }
        }
    }
    </script>

    <template>
    <section>
    <div class="flex-wrap w-3/4 mx-auto py-2 mt-2">
        <form class="flex flex-col w-2/3 gap-1 mx-auto my-0" @submit="formSubmit">
        <h1
        class=" mt-2 mx-auto text-center font-bold text-xl text-text text-slate-50 my-2 border-b-2 border-fg"
        >
        Add Category
        </h1>
        <FormInput label="Name" placeholder="Name of category..." name="name" v-model="name" type="text" error="Incorrect name"></FormInput>
        <FormInput label="Description" placeholder="Description of category..." name="description" v-model="description" type="text" error="Incorrect description"></FormInput>
        <div class="mt-4">
        <span class="block text-sm font-bold">Image :</span>
        <input accept="image/*" label="Image" placeholder="Image of category..." name="image" type="file" multiple error="Incorrect image"
             @change="updatePhoto($event.target.files)"
            class="form-control-file mt-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 
            invalid:border-pink-500 invalid:text-pink-600 text-gray-500 placeholder:text-gray-300
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 peer"/>
    </div>
        <FormInput label="Limit" placeholder="Limit of category..." name="limitPerMonthExpense" v-model="limitPerMonthExpense" type="number" error="Incorrect limitPerMonthExpense"></FormInput>
        <input label="send" name="send" value="Add Category" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
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