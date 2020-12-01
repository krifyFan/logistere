<template>
    <div class="navbar-wrap">
        <button @click="goToModule('/heatMap')">热力图</button>
        <button @click="goToModule('/point')">关键字查询</button>
        <button @click="goToModule('/situation')">繁忙数据</button>
    </div>
</template>
<script>
export default {
    methods: {
        goToModule(path) {
            this.$router.push(path)
        }
    }
}
</script>
<style scoped>
    .navbar-wrap {
        position: absolute;
        z-index: 999;
        right: 10px;
        top: 10px;
    }
    button {
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
    }
</style>