<template>
    <div id="app">
        <navBar />
      	<router-view/>
    </div>
</template>
<script>
import navBar from './components/navBar.vue'
export default {
    components: {
        navBar
    }
}
</script>
