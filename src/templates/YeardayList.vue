<template>
    <div class="yearsday-list">
        <div class="year-banner">
            <span>{{year}}</span>
        </div>
        <div class="week-banner list">
            <div class="outer" v-for="(we, i) in week_ref" :key="i + 'we'"><span v-text="we"></span></div>
        </div>
        <div class="a-month" :class="{'toMonth': sm===i, [`month_is${i}`]: true}" v-for="i in 12" :key="i + 'am'">
            <div class="month-label">
                <span v-text="month_ref[i-1] + '月'"></span>
            </div>
            <div class="days-group">
                <!-- <div v-for="d in getMonthDayNum(year, i)" :key="d + 'd'">
                    <div v-for="fes in fullYearFes" :key="fes.time">
                        <div class="poit circle" v-if="`${year}/${i}/${d}` === fes.time" :style="position(year, i, d)"></div>
                    </div>
                </div> -->
                <div v-for="sp in getMMsp(year, i)" :key="sp + 'sp'"></div>
                <div v-for="d in getMonthDayNum(year, i)" :key="d + 'd'" @click="scrollToThisMonth($event, i, d, (fullYearFes[year]&&fullYearFes[year][i]&&fullYearFes[year][i][d])||[])">
                    <span v-text="d"></span>
                    <div class="poit" v-if="sm===i && d===sd" :title="`今日，${year}年${i}月${sd}日`"></div>
                    <!-- 节日标记 -->
                    <div class="poit circle" v-for="(fes, idx) in (fullYearFes[year]&&fullYearFes[year][i]&&fullYearFes[year][i][d]) || []" :key="idx+'fes'"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
let date = new Date();
var that = null;
import { scrollToCh_Ele , sloarToLunar , dateFormat , specialResolveSD } from "../utils";
dateFormat();
import { festivals } from "../../server/data/festivalsData";
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
            return {'left': `calc(100% / 7 * ${(d+this.getMMsp(y, m)-1)%7})`, 'top': `${Math.floor((d+this.getMMsp(y, m))/7)*32}px`};
        },
        scrollToThisMonth (this_obj, i, d, fes) {
            let ch = window.document.querySelector(`.month_is${i}`);
            let fa = window.document.querySelector(".yearsday-list").parentNode;
            scrollToCh_Ele(
                fa,
                ch,
                -7 + fa.scrollTop,
                400
            );
            console.log(fes)
            this.setScreen(`${this.year}年${i}月${d}日，${fes.length?fes.join('，'):'无事件'}`)
        },
        setScreen (val) {
            this.$parent.screen = val;
        },
        backToMonth () {
            let fa = window.document.querySelector(".yearsday-list").parentNode;
            scrollToCh_Ele(
                fa, 
                window.document.querySelector(".toMonth"),
                -7 + fa.scrollTop,
                800
            );
        },
        queryFestival (yyyy, queryList) {
            console.log(festivals);
            const a_day = 86400000;
            let start = new Date(yyyy, 0, 1).valueOf();
            let to = new Date(yyyy+1, 0, 1).valueOf();
            // let b = 0;
            let tmp = {};
            for(var s=start; s<to; s += a_day){
                let dat = new Date(s);
                let y = parseInt(dat.format("yyyy")), m = parseInt(dat.format("M")), d = parseInt(dat.format("d"));
                let l_d = sloarToLunar(y, m, d), lm = l_d.lunarMonth, ld = l_d.lunarDay;
                for(var i=0, len=queryList.length; i<len; i++){
                    // 遍历农历节日
                    let q_item = festivals[queryList[i]];
                    if(q_item["ld"][lm] && q_item["ld"][lm][ld]){
                        tmp[y] || (tmp[y]={});
                        tmp[y][m] || (tmp[y][m]={});
                        tmp[y][m][d] || (tmp[y][m][d]=[]);
                        tmp[y][m][d].push(q_item["ld"][lm][ld]);
                    }
                    // 遍历公历节日
                    if(q_item["sd"][m] && q_item["sd"][m][d]){
                        tmp[y] || (tmp[y]={});
                        tmp[y][m] || (tmp[y][m]={});
                        tmp[y][m][d] || (tmp[y][m][d]=[]);
                        tmp[y][m][d].push(q_item["sd"][m][d]);
                    }
                }
                // b++
            };
            // 遍历特殊节日
            let query_obj = festivals["specials"]["sd"];
            for(var ty in query_obj){
                if(queryList.indexOf(ty)===-1) continue;
                let obj = query_obj[ty];
                for(var sp_day in obj){
                    let solar_date = new Date(specialResolveSD(sp_day, that.year));
                    let y = parseInt(solar_date.format("yyyy")), m = parseInt(solar_date.format("M")), d = parseInt(solar_date.format("d"));
                    tmp[y] || (tmp[y]={});
                    tmp[y][m] || (tmp[y][m]={});
                    tmp[y][m][d] || (tmp[y][m][d]=[]);
                    tmp[y][m][d].push(obj[sp_day]);
                }
            }
            return tmp;
        }
    },
    data () {
        return {
            year: 2019,
            sm: parseInt(date.format("M")),
            sd: parseInt(date.format("d")),
            fullYearFes: {},
            week_ref: ["一", "二", "三", "四", "五", "六", "日"],
            month_ref: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
        }
    },
    mounted () {
        this.fullYearFes = this.queryFestival(that.year, ["important", "not-important"]);
        // console.log(this.queryFestival(2019));
        this.backToMonth();
        this.$parent.bottom_displayer = true;
        let fes = (this.fullYearFes[this.year]&&this.fullYearFes[this.year][this.sm]&&this.fullYearFes[this.year][this.sm][this.sd])||[];
        this.setScreen(`${this.year}年${this.sm}月${this.sd}日，${fes.length?fes.join('，'):'今日'}`);
    },
    created () {
        that = this;
    }
}
</script>
<style>
.yearsday-list{
    background-color: #f5f5f5;
    padding-bottom: 40px;
}
.year-banner-displayer{
    position: absolute; bottom: 0; left: 2.25rem; z-index: 1;
    padding: .25rem; cursor: default;
}
.year-banner-displayer .screen{
    display: flex; justify-content: center; align-items: center; padding: .25rem;
    box-sizing: border-box; border: 1px solid #ea2325; background-color: rgba(234, 35, 37, .85); color: #fff; letter-spacing: .0525rem;
    box-shadow: 0 0 4px rgba(255, 0, 0, .56) inset;
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
.a-month.toMonth .month-label{
    background-color: #ea2325;
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
    width: calc(100% - 32px); color: #666;
}
.a-month.toMonth .days-group{
    color: #111;
}
.days-group > div{
    position: relative;
    display: flex; justify-content: center; align-items: center;
    width: calc(100% / 7.001); height: 2rem; background-color: #fff;
    box-sizing: border-box; border: 1px solid transparent; 
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
    border: 1px solid #ea2325;
}
.days-group > div:empty, .days-group > div:empty:hover{
    cursor: default; 
    border-color: transparent;
    background-color: transparent;
}
.poit{
    width: 100%; height: 100%;
    position: absolute!important; background-color: transparent!important; border: 0!important;
}
.poit::after{
    display: block; content: ""; width: 100%; height: 100%; border: 0; 
    /* check tick */
    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiI+PHBhdGggZD0iTTcuMjQgMTUuNzZMNCAxOWw5LjUgOS41TDMyLjYyMSA5LjM3OWwtMy4yNC0zLjIzOEwxMy41IDIyLjAyeiIgZmlsbD0iI2VhMjMyNSIvPjwvc3ZnPg==) no-repeat 55% 85%;
    background-size: 16px;
}
.poit.circle::after{
    background-position: center;
    background-size: 28.5px 28.5px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTIwLjQ2IDMuODkzYy0uNzktLjExLTEuNTgzLS4xNjItMi4zNzctLjIxNi0xLjU3Mi0uMDcyLTMuMTUtLjA2Ny00LjcxNi4xMDctLjQyLjA0Ni0uODM3LjExMi0xLjI1NS4xNjgtMS44LjI5MS0zLjU5MS43Ni01LjE5NCAxLjY1NC0xLjEyNy42MjktMS4yOTIuODUzLTIuMjc1IDEuNjktLjMzNS4zNjQtLjY5My43MS0xLjAwNSAxLjA5My0xLjI5IDEuNTg0LTIuMjQ1IDMuNDk0LTIuNjMyIDUuNTA2LS4wOTQuNDktLjExOC45OTItLjE3NyAxLjQ4Ny4wMjYuNDg2LjAwNS45NzYuMDc2IDEuNDU2YTYuNzQ4IDYuNzQ4IDAgMCAwIDEuOTI4IDMuODQyYzEuMDM2IDEuMDI4IDEuNjI2IDEuMjM2IDIuOTExIDEuOTUzLjYzNy4yNCAxLjI2LjUyMyAxLjkxMS43MjIgMi44NC44NjggNS45MSAxLjA1NiA4LjgyNi40ODQuNzEtLjE0IDEuMzk2LS4zNzYgMi4wOTUtLjU2NC42NC0uMjc2IDEuMy0uNTA4IDEuOTE5LS44MjkgMi4yMTYtMS4xNSA0LjI0Mi0yLjk2IDUuNDktNS4xMzcuMjc5LS40ODYuNDc0LTEuMDE2LjcxLTEuNTI1LjEzMy0uNTEyLjMyMS0xLjAxNC4zOTgtMS41MzguMjI0LTEuNTQyLS4xLTMuMDg4LS45OS00LjM3Ny0uODczLTEuMjY3LTEuNDY3LTEuNTUtMi43MDMtMi40ODUtLjY2Mi0uMzQyLTEuMy0uNzM2LTEuOTg2LTEuMDI0LTMuMzQ1LTEuNDAyLTcuMjIyLTEuNzctMTAuODA4LTEuNDItLjk4NC4wOTctMS45NTUuMy0yLjkzMi40NWwtMi43OC43NTljLS4yMTguMDc5LS41NjktLjg5LS4zNS0uOTdsMi44ODUtLjgwMmMxLjAxNC0uMTU3IDIuMDItLjM3NyAzLjA0My0uNDcgMy44MjUtLjM1MyA3LjkwNC4wNzIgMTEuNDM3IDEuNjUyLjcyMy4zMjQgMS4zOS43NjIgMi4wODUgMS4xNDMgMS4zMzQgMS4wNjkgMS45NTEgMS4zNzggMi44OCAyLjgwOC45NTcgMS40NyAxLjMgMy4yMDggMS4wNDUgNC45MzUtLjA4NC41NzMtLjI4OCAxLjEyMS0uNDMyIDEuNjgyLS4yNTQuNTUtLjQ2MyAxLjEyMi0uNzYyIDEuNjQ5LTEuMzE3IDIuMzItMy40NTUgNC4yNTEtNS44MDYgNS40ODYtLjY1NC4zNDMtMS4zNTMuNTkzLTIuMDMuODktLjczNi4yMDEtMS40NTkuNDU1LTIuMjA3LjYwNi0zLjEwOS42MjQtNi40MDcuNDAzLTkuNDE5LS41NzktLjY4Ni0uMjIzLTEuMzM5LS41MzgtMi4wMDgtLjgwNy0xLjM5LS44Mi0xLjk5LTEuMDM5LTMuMTAyLTIuMTk4YTcuNzMzIDcuNzMzIDAgMCAxLTIuMDc4LTQuMjk3Yy0uMDc0LS41MjUtLjA1LTEuMDU5LS4wNzUtMS41ODguMDY0LS41MzIuMDktMS4wNy4xOTItMS41OTguNDE0LTIuMTM3IDEuNDMyLTQuMTYxIDIuODEtNS44MzguMzM0LS40MDcuNzE3LS43NzIgMS4wNzUtMS4xNTggMS4wNTQtLjg5IDEuMjM2LTEuMTMxIDIuNDQtMS44MDIgMS42NzMtLjkzMiAzLjU0Mi0xLjQyOSA1LjQyNC0xLjcxOS40MzEtLjA1NC44NjEtLjExOSAxLjI5NC0uMTYzIDEuNjUtLjE2NyAzLjMxMy0uMTQxIDQuOTY3LS4wMjkuNzk0LjA3MyAxLjU5LjE0NSAyLjM3NS4yOTIuMTQuMDI2LjAyMi42NDYtLjExOC42MTl6IiBmaWxsPSIjZWEyMzI1Ii8+PC9zdmc+)!important;
}
</style>