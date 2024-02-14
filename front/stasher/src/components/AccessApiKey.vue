        <script>
        import FormInput from "../components/FormInput.vue";
        import axios from "axios";


        export default {
        name: 'accessAPIKey',
        data: function () {
            return {
                key: "",
                errors: [],
                url: import.meta.env.VITE_API_ENDPOINT,
                message: ''
            }
        },
        mounted() {
            this.getAPIKey();
        },
        components: {
            FormInput,
            axios
        },
            methods: {
                refreshKey: function (e)  {
                e.preventDefault();
                let currentObj = this;
                    this.axios
                    .get(this.url + "/key/refresh", {
                        crossDomain: true,
                        withCredentials: true,
                        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Access-Control-Allow-Origin':"*",
                                'Access-Control-Allow-Credentials':true }
                        })
                    .then(function (response) {
                        console.log(response)
                        currentObj.errors = [];
                        currentObj.getAPIKey();
                    })
                    .catch(function (error) {
                        currentObj.errors.push(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                    })
                },
                getAPIKey: function (e) {
                let currentObj = this;
                this.axios
                    .get(this.url + "/key", {
                    crossDomain: true,
                    withCredentials: true,
                    headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Access-Control-Allow-Origin':"*",
                            'Access-Control-Allow-Credentials':true }
                    })
                    .then(function (response) {
                        console.log(response)
                        currentObj.key = response.data.message;
                    })
                    .catch(function (error) {
                        currentObj.errors.push(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                    })
                }
            }
        }
        </script>

        <template>
        <section>
        <div class="flex-wrap w-3/4 mx-auto py-2 mt-2">
            <form class="flex flex-col w-2/3 gap-1 mx-auto my-0" @submit="refreshKey">
            <h1
            class=" mt-2 mx-auto text-center font-bold text-xl text-text text-slate-50 my-2 border-b-2 border-fg"
            >
            API Key
            </h1>
            <FormInput label="Key" placeholder="key of API..." name="Key" :value="key" type="text" error="Incorrect key" :readonly="true"
            ></FormInput>
            <input label="refresh" name="refresh" value="Refresh" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
            />
            <p v-if="errors.length" class="mt-4 text-rose-900">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
            </p>
            <p v-if="message.length" class="mt-4 text-white-900">
            <b>key sent!</b>
            </p>
            </form>
        </div>
        </section>
        </template>