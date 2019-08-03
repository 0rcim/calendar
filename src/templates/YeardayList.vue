<template>
    <div class="yearsday-list">
        <div class="year-banner">
            <span>{{year}}</span>
        </div>
        <div class="week-banner list">
            <div class="outer" v-for="(we, i) in week_ref" :key="i + 'we'"><span v-text="we"></span></div>
        </div>
        <div class="a-month" :class="{'toMonth': sm===i}" v-for="i in 12" :key="i + 'am'">
            <div class="month-label">
                <span v-text="month_ref[i-1] + '月'"></span>
            </div>
            <div class="days-group">
                <div class="poit" :style="position(year, i, sd)" v-if="sm===i" :title="`今日，${year}年${i}月${sd}日`"></div>
                <div v-for="sp in getMMsp(year, i)" :key="sp + 'sp'"></div>
                <div v-for="d in getMonthDayNum(year, i)" :key="d + 'd'"><span v-text="d"></span></div>
            </div>
        </div>
    </div>
</template>
<script>
let date = new Date();
import { scrollToCh_Ele } from "../utils";
export default {
    "name": "yeardayList",
    "methods": {
        getMonthDayNum (_yyyy, _MM) {
            var d = new Date(_yyyy, _MM, 0);
            return d.getDate();
        },
        getMMsp (_yyyy, _MM) {
            var weekNum = new Date(`${_yyyy}/${_MM}`+"/01").getDay();
            return weekNum === 0 ? 6 : weekNum - 1;
        },
        position (y, m, d) {
            return {'left': `calc(100% / 7 * ${(d+this.getMMsp(y, m)-1)%7})`, 'top': `${Math.floor((d+this.getMMsp(y, m))/7)*22}px`};
        }
    },
    data () {
        return {
            year: 2019,
            sm: parseInt(date.format("M")),
            sd: parseInt(date.format("d")),
            week_ref: ["一", "二", "三", "四", "五", "六", "日"],
            month_ref: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
        }
    },
    mounted () {
        scrollToCh_Ele(
            window.document.querySelector(".yearsday-list").parentNode, 
            window.document.querySelector(".toMonth"),
            7.2,
            800
        )
    }
}
</script>
<style>
.yearsday-list{
    background-color: #f5f5f5;
}
.year-banner{
    display: flex; align-items: center; justify-content: flex-start;
    width: 100%; height: 2rem;
    background-color: #f5f5f5;
}
.year-banner span{
    font-size: 14px; font-weight: 400; color: #666;
    padding-left: 32px;
    letter-spacing: .0525rem;
}
.week-banner.list{
    padding: 0; padding: .45rem 0;
    justify-content: flex-end;
}
.week-banner.list .outer{
    width: calc((100% - 32px) / 7.001)
}
.a-month{
    display: flex; flex-wrap: nowrap;
    min-height: 8rem;
    padding-bottom: .45rem;
}
.month-label{
    display: flex; justify-content: center; align-items: center;
    width: 32px; background-color: rgba(234, 35, 37, .65); cursor: default;
    font-size: 14px; color: #fff;
}
.month-label span{
    letter-spacing: .0525rem; white-space: nowrap; display: block; transform: rotate(-90deg); transform-origin: center;
}
.days-group{
    position: relative;
    display: flex; flex-direction: row; flex-wrap: wrap; 
    width: calc(100% - 32px); color: #111;
}
.days-group > div{
    display: flex; justify-content: center; align-items: center;
    width: calc(100% / 7.001); height: 2rem; background-color: #fff;
    box-sizing: border-box; border: .5px solid transparent; 
    cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.days-group > div:empty + div:not(:empty){
    background-color: #fcfcfc;
    border-top-left-radius: .25rem;
}
.days-group > div:last-child{
    background-color: #fcfcfc;
    border-bottom-right-radius: .25rem;
}
.days-group > div:hover{
    border: .5px solid #ea2325;
}
.days-group > div:empty, .days-group > div:empty:hover{
    cursor: default; 
    border-color: transparent;
    background-color: transparent;
}
.poit{
    position: absolute!important; background-color: transparent!important; border: 0!important;
}
.poit::after{
    display: block; content: ""; width: 100%; height: 100%; border: 0; 
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHBhdGggZD0iTTcuMjQgMTUuNzZMNCAxOWw5LjUgOS41TDMyLjYyMSA5LjM3OWwtMy4yNC0zLjIzOEwxMy41IDIyLjAyeiIgZmlsbD0iI2VhMjMyNSIvPjwvc3ZnPg==) no-repeat 55% 85%;
    background-size: 16px;
}
</style>