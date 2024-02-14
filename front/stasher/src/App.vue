<script>
import CustomHeader from "./components/CustomHeader.vue"
import Home from "./views/Home.vue"
export default {
    name: 'app',
    components: {
        CustomHeader,
        Home
    },
    data () {
        return {
            headerRefresh: 0
        }
    }
}
</script>

<template>
  <body class="w-full min-w-[1080px] min-h-screen text-text bg-bg text-slate-50 main-section-banner">
    <CustomHeader :key=headerRefresh />
    <router-view @ready="childVal => { headerRefresh++ }"/>
  </body>
</template>
