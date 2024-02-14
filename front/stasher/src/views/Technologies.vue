<script>
import vueIcon from "../assets/technologies/vueIcon.png";
import typescriptIcon from "../assets/technologies/typescriptIcon.png";
import tailwindIcon from "../assets/technologies/tailwindIcon.png";

const technologies = [
  { name: "VueJs", img: vueIcon, url: "https://vuejs.org/" },
  { name: "Typescript", img: typescriptIcon, url: "https://www.typescriptlang.org/" },
  { name: "TailwindCSS", img: tailwindIcon, url: "https://tailwindcss.com/" },
];
export default {
  name: "technologies",
  data: function () {
    return {
      technologies: technologies,
    };
  },
};
</script>

<template>
  <body class="w-full min-h-screen text-text bg-bg">
    <article class="flex flex-col w-1/3 gap-16 mx-auto my-0 py-16">
      <h1 class="w-full py-4 border-b-2 border-fg font-bold text-4xl text-text ">
        Technologies
      </h1>
      <p class="">
        This is a VueJs project using Typescript as language and TailwindCSS for stylization.
      </p>
      <ul class="flex flex-wrap w-full justify-center gap-4 50">
        <li v-for="technology in technologies">
          <a :href="technology.url" target="_blank">
            <img :src="technology.img" :alt="technology.name" :title="technology.name" width="40" />
          </a>
        </li>
      </ul>
    </article>
  </body>
</template>
