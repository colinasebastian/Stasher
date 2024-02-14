<script>
export default {
  name: 'formInput',
  props: {
    number: {
      type: String,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    error: {
      type: String,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    accept: {
      type: String,
      required: false
    }
  }
}
</script>

<template>
    <div class="mt-4">
        <span class="block text-sm font-bold">{{label}} :</span>
        <input 
            @blur="handleInput"
            :placeholder="placeholder"
            :autocomplete="type"
            :type="type"
            :name="name"
            :value="value"
            :readonly="readonly"
            :accept="accept"
            class="mt-4 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 
            invalid:border-pink-500 invalid:text-pink-600 text-gray-500 placeholder:text-gray-300
            focus:invalid:border-pink-500 focus:invalid:ring-pink-500 peer"/>
    </div>
</template>
