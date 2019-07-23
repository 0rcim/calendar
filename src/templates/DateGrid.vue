// 日期数字小方格 - new 
<template>
    <div class="date-grid" :class="{'isToday': isToday}" @click="selected">
        <div class="grid-bg" v-if="(isToday || isSelected || hasNotes)">
            <span class="todayHighLight" v-if="isToday"></span>
            <span class="otherHighLight" v-if="isSelected"></span>
            <span class="noteTip" :class="{'active': isToday}" v-if="hasNotes">
                <span></span>
            </span>
        </div>
        <div class="solar-date"><span v-text="s_txt"></span></div>
        <div class="lunar-date"><span v-text="l_txt"></span></div>
    </div>
</template>
<script>
export default {
    "name": "dateGrid",
    "props": ["s_txt", "l_txt", "isToday", "isSelected", "hasNotes"],
    "methods": {
        selected () {
            this.$emit("selected", this.s_txt);
        }
    }
}
</script>
<style>
.date-grid{
    position: relative;
    display: flex; flex-wrap: wrap;
    font-size: 1rem;
    height: 75px;
    min-width: 36px; width: calc(100% / 7);
    box-sizing: border-box;
    border: .5px solid #fff; border-top: 0; border-bottom: 0;
    border-radius: .45rem;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    transition: background-color 350ms;
    overflow: hidden;
}
.date-grid.isToday .solar-date span, .date-grid.isToday .lunar-date span{color: #fff;}
.date-grid .grid-bg{
    position: absolute; top: 0; left: 0; z-index: 1;
    width: 100%; height: 100%; 
}
.grid-bg span{
    display: block;
    width: 100%; height: 100%;
    transition: background-color 400ms;
}
.grid-bg span.todayHighLight{
    background-color: #ea5245;
}
.grid-bg span.otherHighLight{
    background-color: #fdf1f0;
}
.grid-bg span.noteTip{
    position: absolute; top: 0; left: 0;
    display: block;
    width: 100%; height: 100%;
    transition: background-color 400ms;
}
.grid-bg span.noteTip > span{
    position: absolute; left: 0; bottom: 0; 
    display: flex; justify-content: center; align-items: center;
    width: 100%; height: 15px;
}
.grid-bg span.noteTip > span::after{
    content: "";
    width: .45rem; height: 2px; 
    border-radius: 1px;
    background-color: #e3e3e3;
}
.grid-bg span.noteTip.active > span::after{
    background-color: #fff;
}
.solar-date{
    position: relative; z-index: 1;
    width: 100%; height: 50%;
    display: flex; align-items: flex-end; justify-content: center;
}
.solar-date span{
    padding-bottom: .25rem;
    font-size: 16.5px;
}
.lunar-date{
    position: relative; z-index: 1;
    width: 100%; height: 50%;
    display: flex; align-items: flex-start; justify-content: center;
}
.lunar-date span{
    font-size: 10px; -webkit-text-size-adjust: none;
    color: #999;
}
@media only screen and (min-width: 512px) {
    .date-grid:hover{background-color: rgba(0, 0, 0, .05);}
    .date-grid:empty{border-color: transparent;}
    .date-grid:empty:hover{background-color: transparent; cursor: default;}
}
</style>

