        <script>
        import FormInput from "../components/FormInput.vue";
        import axios from "axios";

        export default {
        name: 'inviteMember',
        data: function () {
            return {
                email: "",
                errors: [],
                url: import.meta.env.VITE_API_ENDPOINT,
                message: ''
            }
        },
        components: {
            FormInput,
            axios
        },
        mounted(){
        },
            methods: {
                formSubmit: function (e)  {
                this.email = e.target.email.value;
                e.preventDefault();
                let currentObj = this;
                currentObj.errors = [];
                if (this.checkForm()){
                    this.axios
                    .post(this.url + "/administrator/invitation", {
                        "email": this.email
                    }, {
                crossDomain: true,
                withCredentials: true,
                headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Access-Control-Allow-Origin':"*",
                        'Access-Control-Allow-Credentials':true }
            })
                    .then(function (response) {
                        console.log(response)
                        currentObj.message = "Invitation sent successfully";
                    })
                    .catch(function (error) {
                        currentObj.errors.push(error);
                    })};
                },
                checkForm: function () {
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
        }
        </script>

        <template>
        <section>
        <div class="flex-wrap w-3/4 mx-auto py-2 mt-2">
            <form class="flex flex-col w-2/3 gap-1 mx-auto my-0" @submit="formSubmit">
            <h1
            class=" mt-2 mx-auto text-center font-bold text-xl text-text text-slate-50 my-2 border-b-2 border-fg"
            >
            Invite family members
            </h1>
            <FormInput label="Email" placeholder="Email of member..." name="email" v-model="email" type="email" error="Incorrect email"
            ></FormInput>
            <input label="send" name="send" value="Send Invitation" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 px-4 inline-block mt-6 rounded w-full"
            />
            <p v-if="errors.length" class="mt-4 text-rose-900">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
            </p>
            <p v-if="message.length" class="mt-4 text-white-900">
            <b>Email sent!</b>
            </p>
            </form>
        </div>
        </section>
        </template>