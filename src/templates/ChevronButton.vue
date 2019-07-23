<template>
    <div class="chevron-button" :class="{[position]: true}">
        <div class="activer" @mouseover="shown" @mouseout="hidden" @click="slideMonth">
            <transition name="fade">
                <img :src="`src/img/chevron_${position}.svg`" :alt="`chevron_${position}.svg`" v-show="chevronShow">
            </transition>
        </div>
    </div>
</template>
<script>
export default {
    "name": "chevronBtn",
    "props": ["position", "chevronShow"],
    "methods": {
        shown () {
            this.$emit("shown", this.position);
        },
        hidden () {
            this.$emit("hidden", this.position);
        },
        slideMonth () {
            this.$emit("slideMonth", this.position);
        }
    }
}
</script>
<style>
.chevron-button{
    position: absolute; top: 0; z-index: 2;
    display: flex; align-items: center;
    width: 8px; height: 100%;
    /* background-color: green; */
}
.chevron-button.left{
    left: 0;
}
.chevron-button.right{
    right: 0;
}
.chevron-button .activer{
    display: flex; align-items: center;
    height: 72%; width: 100%;
    /* background-color: blue; */
    opacity: .8;
}
.chevron-button .activer:active{
    opacity: 1;
}
.chevron-button.left .activer{
    flex-direction: row;
}
.chevron-button.right .activer{
    flex-direction: row-reverse;
}
.chevron-button .activer img{
    cursor: pointer; -webkit-tap-highlight-color: transparent;
}
</style>

