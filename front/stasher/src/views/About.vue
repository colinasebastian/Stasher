<script>
import sebaPic from "../assets/seba.png";

const creators = [
  { name: "Sebastián Colina", img: sebaPic},
];

export default {
  name: 'about',
  data: function () {
      return {
          creators: creators
      }
  }
}

</script>

<template>
  <body class="w-full text-text text-slate-50  bg-bg">
    <article class="flex flex-col w-1/3 gap-4 mx-auto my-0 py-16">
      <h1 class="w-full py-4 border-b-2 border-fg font-bold text-4xl text-text ">About</h1>
      <p class="pt-6">
        Stasher is a budget tracker for the modern age. 
        Say no more to carrying paper envelopes. 
        This virtual budget program keeps you on track with family and friends with the time-tested envelope budgeting method.
        <br />
        <br />
        Developed by:
      </p>
    </article>
    <article class="flex flex-col w-2/3 gap-4 mx-auto my-0">
        <ul class="flex flex-wrap w-full justify-center gap-16">
        <li v-for="creator in creators">
          <a :href="creator.url" target="_blank">
            <img :src="creator.img" :alt="creator.name" :title="creator.name" width="140" class="mx-auto rounded-full"/>
          </a>
          <h3 v-text="creator.name" class="text-center pt-5"></h3>
          <h5 v-text="creator.code" class="text-center"></h5>
        </li>
      </ul>
        
    </article>
  </body>
</template>
