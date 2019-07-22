// 一二三四五六日 模板
<template>
    <div class="week-banner">
        <div class="outer" v-for="(v, k, i) in arr" :key="i"><span v-html='v' v-if='v'></span></div>
    </div>
</template>
<script>
export default {
    "name": "weekBanner",
    "props": ["arr"]
}
</script>
<style>
.week-banner{display: flex; flex-wrap: nowrap; width: 100%; padding-top: 1rem;}
.week-banner .outer{width: 100%; display: flex; justify-content: center;}
.week-banner .outer span{font-size: 12px; color: #999;}
</style>
