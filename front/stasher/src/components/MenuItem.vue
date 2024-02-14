<script>
export default {
  name: 'menuItem',
  props: {
    selected: {
      type: Boolean,
      required: true
    },
    text : {
      type: String,
      required: true
    }
  },
    mount(){
        console.log(this.selected);
    }
}
</script>

<template>
    <button class="mt-5 flex-wrap block font-bold py-2 px-4 rounded w-full text-center" :class = "!this.selected ? 'bg-stone-200 hover:text-stone-100 hover:bg-stone-400 text-rose-900' : 'bg-rose-700 hover:bg-rose-900 text-white'">
        {{text}}
     </button>
</template>
