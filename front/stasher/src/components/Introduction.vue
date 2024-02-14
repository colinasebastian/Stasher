<script>
import frontPic from "../assets/front.png"
export default {
  name: 'introduction',
  data: function () {
      return {
          frontPic: frontPic
      }
  }
}
</script>


<template>
  <section class="flex w-3/4 mx-auto justify-center py-16 mt-16">
    <div class="w-1/3 justify-left">
    <h1 class="text-slate-50 flex w-full justify-left text-left py-3 text-slate-50 font-extrabold text-3xl">
      Stasher: All-in-one family finance
    </h1>
    <h3 class="text-slate-50 flex w-full text-left py-3 text-slate-50 font-semibold text-medium">
      Stasher is the smart way to track and manage your financial life. 
      Get award-winning financial tools and personal attention from registered financial advisors for significantly less than traditional financial advisors.
    </h3>
    <router-link to="/adminUserReg" class="bg-rose-700 hover:bg-rose-900 text-white font-bold py-2 px-4 inline-block mt-5 rounded w-full text-center">
      Try it free now
    </router-link>
    <router-link to="/userLogin" class="bg-stone-200 hover:text-stone-100 hover:bg-stone-400 text-rose-900 font-bold py-2 px-4 inline-block mt-5 rounded w-full text-center">
        Sign in
     </router-link>
    </div>
    <img :src="frontPic" alt="front" title="front" class="pl-12 w-2/3 object-contain	" />
  </section>
</template>
