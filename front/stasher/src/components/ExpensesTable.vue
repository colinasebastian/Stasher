<script>

import axios from "axios";
import ModifyExpense from "./ModifyExpense.vue";


export default {
name: 'expensesTable',
data: function () {
    return {
        isAdmin: JSON.parse(localStorage.getItem('user'))?.role === "administrator",
        fromDate: "",
        toDate: "",
        expenses: [],
        url: import.meta.env.VITE_API_ENDPOINT,
        currentPage: 1,
        totalPages: 0,
        expenseToModify: 0,
        expenseDate: "",
        expenseAmount: 0,
        expenseDescription: "",
        chartData: {},
        chartOptions: {
          chart: {
            id: 'Categories'
          },
          xaxis: {
            categories: []
          },
          fill: {
            colors: ['#fff']
            },
            dataLabels: {
            style: {
                colors: ['#BD123C']
            }
            }
        },
        series: [{
          name: 'Values',
          data: []
        }]
    }
},
components: {
    axios,
    ModifyExpense
},
mounted () {
    let today = new Date();
    let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0,10);
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0,10);
    this.fromDate = firstDayOfMonth;
    this.toDate = lastDayOfMonth;
    this.getExpenses();
    this.getChartData();
},
    methods: {
        getChartData: function () {
            let currentObj = this;
            this.axios
                .get(this.url + "/expenses/amount?dateFrom=" 
                            + new Date(this.fromDate).toISOString() 
                            + "&dateTo=" + new Date(new Date().setDate(new Date(this.toDate).getDate() + 1)).toISOString()
                            + "&page=" + (this.currentPage - 1), {
        crossDomain: true,
        withCredentials: true,
        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Credentials':true }
        })
                .then(function (response) {
                    currentObj.chartData = response.data.data;
                    Object.keys(currentObj.chartData).forEach(element => currentObj.chartOptions.xaxis.categories.push(element));
                    currentObj.series[0].data = Object.values(currentObj.chartData);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getExpensesFromCustomDates: function (e)  {
            let currentObj = this;
            this.axios
                .get(this.url + "/expenses?dateFrom=" 
                            + new Date(this.fromDate).toISOString() 
                            + "&dateTo=" + new Date(new Date().setDate(new Date(this.toDate).getDate() + 1)).toISOString()
                            + "&page=0", {
        crossDomain: true,
        withCredentials: true,
        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Credentials':true }
        })
                .then(function (response) {
                    console.log(response)
                    currentObj.expenses = response.data.data.expenses;
                    currentObj.totalPages = response.data.data.totalPages;
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response?.data?.message === "jwt expired" || error.response?.data?.message === "jwt malformed") {
                        localStorage.removeItem('user');
                        currentObj.$router.push('/userLogin');
                    }
            });
            this.getChartData();
        },
        getExpenses: function ()  {
        let currentObj = this;
            this.axios
                .get(this.url + "/expenses?dateFrom=" 
                            + new Date(this.fromDate).toISOString() 
                            + "&dateTo=" + new Date(new Date().setDate(new Date(this.toDate).getDate() + 1)).toISOString()
                            + "&page=" + (this.currentPage - 1), {
        crossDomain: true,
        withCredentials: true,
        headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token,
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin':"*",
                'Access-Control-Allow-Credentials':true }
        })
                .then(function (response) {
                    console.log(response)
                    currentObj.expenses = response.data.data.expenses;
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
            this.getExpenses();
            this.getChartData();
        },
        deleteExpense: function (e)  {
            e.preventDefault();
            let currentObj = this;
            this.axios
                .delete(this.url + "/expenses/" + e.target.value, {headers: { 'authentication': JSON.parse(localStorage.getItem('user'))?.token }})
                .then(function (response) {
                    console.log(response)
                    currentObj.getExpenses();
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
<section class="mb-10">
<div class="flex-wrap w-3/4 mx-auto p-8 min-h-[350px] bg-stone-200  border-b-2 rounded-md text-gray-500 mt-2">
    <h1
      class=" mt-2 w-1/3 mx-auto content-center text-center h-max font-bold text-xl text-text my-2  border-b-2 border-slate-500">
      Expenses Dashboard
    </h1>
    <div>
     <apexchart height="300" type="bar" :key="series[0]?.data" :options="chartOptions" v-show="Array.isArray(series[0]?.data) && series[0]?.data.length != 0" :series="series"></apexchart>
   </div>
    <table class="table-auto w-full " v-show="expenses.length != 0">
        <thead>
                <th class="px-4 py-2 text-slate-500">Id</th>
                <th class="px-4 py-2 text-slate-500">Date</th>
                <th class="px-4 py-2 text-slate-500">Amount</th>
                <th class="px-4 py-2 text-slate-500">Description</th>
        </thead>
        <tbody>
            <tr v-for="expense in expenses" :key="expense.id">
                <td class="border px-4 py-2 border-slate-500">{{expense.id}}</td>
                <td class="border px-4 py-2 border-slate-500">{{expense.producedDate?.split("T")[0]}}</td>
                <td class="border px-4 py-2 border-slate-500">{{expense.amount}}</td>
                <td class="border px-4 py-2 border-slate-500">{{expense.description}}</td>
                <td v-show="isAdmin" class="border px-4 py-2 border-slate-500"><button class="bg-stone-200 text-rose-900" 
            @click="expenseToModify = expense.id;
                    expenseDate = expense.producedDate;
                    expenseAmount = expense.amount;
                    expenseDescription = expense.description">Modify</button></td>
                <td v-show="isAdmin" class="border px-4 py-2 border-slate-500"><button class="bg-stone-200 text-rose-900" :value="expense.id"
            @click="deleteExpense">Delete</button></td>
            </tr>
        </tbody>
    </table>
    <div class="w-full align-middle m-auto block text-center font-bold text-l text-text text-slate-500 my-2 " v-show="expenses.length == 0">No data in range</div>
    <div v-show="expenses.length != 0">
        <h2
      class=" mt-6 mx-auto font-bold inline-block text-l mr-5">
      Page:
    </h2>
        <button class="bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 inline-block mt-6 rounded w-10" 
            @click="changePage" v-for="page in totalPages" :value="page">{{page}}</button></div>
</div>
<form class="flex-wrap w-2/3 mx-auto py-2 mt-2" @submit.prevent="getExpensesFromCustomDates">
    <div class=" w-1/3 mx-auto inline-block px-4">
        <input type="date" class="mt-4 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 
                invalid:border-pink-500 invalid:text-pink-600 text-gray-500 placeholder:text-gray-300 inline-block
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500" name="fromDate" v-model="fromDate"/>
    </div>
    <div class=" w-1/3 mx-auto inline-block px-4">
        <input type="date" class="mt-4 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 
                invalid:border-pink-500 invalid:text-pink-600 text-gray-500 placeholder:text-gray-300 inline-block
                focus:invalid:border-pink-500 focus:invalid:ring-pink-500" name="toDate" v-model="toDate"/>
    </div>
    <div class=" w-1/3 mx-auto inline-block px-4">
    <input label="Range" name="Range" value="Select Range" type="submit" class=" bg-stone-200 hover:bg-stone-400 hover:text-stone-200 text-rose-900 font-bold py-2 inline-block mt-6 rounded w-full"/>
    </div>
</form>
<ModifyExpense @ready="childVal => { expenseToModify = childVal, getExpenses() }" :expenseId="expenseToModify" :expenseDate="expenseDate" :expenseAmount="expenseAmount" :expenseDescription="expenseDescription" v-show="expenseToModify != 0"></ModifyExpense>
</section>
</template>