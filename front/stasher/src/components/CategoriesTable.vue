<script>

import axios from "axios";
import ModifyCategory from "./ModifyCategory.vue";


export default {
name: 'categoriesTable',
data: function () {
    return {
        categories: [],
        url: import.meta.env.VITE_API_ENDPOINT,
        image_url: import.meta.env.VITE_IMG_BUCKET,
        currentPage: 1,
        totalPages: 0,
        categoryToModify: 0,
        categoryName: "",
        categoryDescription: "",
        categoryImage: "",
        categoryLimit: 0
    }
},
components: {
    axios,
    ModifyCategory
},
mounted () {
    this.getCategories();
},
    methods: {
        getCategoriesFromCustomDates: function (e)  {
            let currentObj = this;
            this.axios
                .get(this.url + "/categories?&page=0", {
        crossDomain: true,
        withCredentials: true,
        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Credentials':true }
        })
                .then(function (response) {
                    console.log(response)
                    currentObj.categories = response.data.data.categories;
                    currentObj.totalPages = response.data.data.totalPages;
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                
            });
        },
        getCategories: function ()  {
        let currentObj = this;
            this.axios
                .get(this.url + "/categories?page=" + (this.currentPage - 1), {
        crossDomain: true,
        withCredentials: true,
        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Credentials':true }
        })
                .then(function (response) {
                    console.log(response)
                    currentObj.categories = response.data.data.categories;
                    currentObj.totalPages = response.data.data.totalPages;
                })
                .catch(function (error) {
                console.log(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
            });
        },
        changePage: function (e)  {
            e.preventDefault();
            console.log(e.target.value);
            this.currentPage = e.target.value;
            this.getCategories();
        },
        deleteCategory: function (e)  {
            e.preventDefault();
            let currentObj = this;
            this.axios
                .delete(this.url + "/categories/" + e.target.value, {headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token }})
                .then(function (response) {
                    console.log(response)
                    currentObj.getCategories();
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
                
            });
        },
    }
}
</script>

<template>
<section>
<div class="flex-wrap w-4/5 mx-auto p-8 min-h-[350px] bg-stone-200  border-b-2 rounded-md text-gray-500 mt-2">
    <h1
      class=" mt-2 w-1/3 mx-auto content-center text-center h-max font-bold text-xl text-text my-2  border-b-2 border-slate-500">
      Categories Dashboard
    </h1>
    <table class="table-auto w-full " v-show="categories.length != 0">
        <thead>
                <th class="px-4 py-2 text-slate-500">Id</th>
                <th class="px-4 py-2 text-slate-500">Name</th>
                <th class="px-4 py-2 text-slate-500">Description</th>
                <th class="px-4 py-2 text-slate-500">Image</th>
                <th class="px-4 py-2 text-slate-500">Limit</th>
        </thead>
        <tbody>
            <tr v-for="category in categories" :key="category.id">
                <td class="border px-4 py-2 border-slate-500">{{category.id}}</td>
                <td class="border px-4 py-2 border-slate-500">{{category.name}}</td>
                <td class="border px-4 py-2 border-slate-500 text-xs">{{category.description}}</td>
                <td class="border px-4 py-2 border-slate-500 text-xs "><img class="max-h-14" :src="[image_url, category.image].join('')"/></td>
                <td class="border px-4 py-2 border-slate-500">{{category.limitPerMonthExpense}}</td>
                <td class="border px-4 py-2 border-slate-500"><button class="bg-stone-200 text-rose-900" 
                    @click="categoryToModify = category.id;
                    categoryName = category.name;
                    categoryDescription = category.description;
                    categoryLimit = category.limitPerMonthExpense">Modify</button></td>
                <td class="border px-4 py-2 border-slate-500"><button class="bg-stone-200 text-rose-900" :value="category.id"
            @click="deleteCategory">Delete</button></td>
            </tr>
        </tbody>
    </table>
    <div class="w-full align-middle m-auto block text-center font-bold text-l text-text text-slate-500 my-2 " v-show="categories.length == 0">No data in range</div>
    <div v-show="categories.length != 0">
        <h2
      class=" mt-6 mx-auto font-bold inline-block text-l mr-5">
      Page:
    </h2>
        <button class="bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 inline-block mt-6 rounded w-10" 
            @click="changePage" v-for="page in totalPages" :value="page">{{page}}</button></div>
</div>

<ModifyCategory @ready="childVal => { categoryToModify = childVal, getCategories() }" :categoryId="categoryToModify" :categoryName="categoryName" :categoryAmount="categoryLimit" :categoryDescription="categoryDescription" v-show="categoryToModify != 0"></ModifyCategory>
</section>
</template>