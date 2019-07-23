// 日历主体框架组件
<template>
    <div class="app-container">
        <transition name="bounce">
            <div class="menu-button" v-if="menuLeave">
                <touch-ripple :side="1" @event_click="showNav">
                    <md-ico :codepoint="'menu'" :color="'#ea5245'"></md-ico>
                </touch-ripple>
            </div>
        </transition>
        <transition name="fade">
            <div class="nav" v-if="navIsShow">
                <div class="icon-banner">
                    <touch-ripple :side="1" @event_click="hideNav">
                        <md-ico :codepoint="'close'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                    <touch-ripple :side="0" :title="'设置'">
                        <md-ico :codepoint="'more_horiz'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                    <touch-ripple :side="0" :title="'添加今日便笺'">
                        <md-ico :codepoint="'add'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                </div>
            </div>
        </transition>
        <cale-header :month="dateJSON.month" :day="dateJSON.day" :year="dateJSON.year" :isToday="isToday"></cale-header>
        <week-banner :arr="week_order"></week-banner>
        <div class="slide-container">
            <div class="slide-outer">
                <div class="slide-item" style="background-color: purple;">
                    <!-- prev month -->
                    <dates-table :datesData="prevDatesData" @selected="selected"></dates-table>
                </div>
                <div class="slide-item" style="background-color: #fff;">
                    <!-- this month -->
                    <dates-table :datesData="centerDatesData" @selected="selected"></dates-table>
                </div>
                <div class="slide-item" style="background-color: cornflowerblue;">
                    <!-- next month -->
                    <dates-table :datesData="nextDatesData" @selected="selected"></dates-table>
                </div>
            </div>
        </div>
        <!-- body -->
    </div>
</template>
<script>
import utils from "../utils";
utils.dateFormat();
import mdIco from "./MdIco.vue";
import touchRipple from "./TouchRipple.vue";
import caleHeader from "./CaleHeader.vue";
import weekBanner from "./WeekBanner.vue";
import datesTable from "./DatesTable.vue";
var that = null;
export default {
    "name": "calendarApp",
    // "components": { mdIco , touchRipple , weekBanner, datesTable , caleDate, calePanel },
    "components": { mdIco , touchRipple , weekBanner, datesTable , caleHeader },
    "computed": {
        isToday () {
            console.log("#62", that._toMonth_, that.prev_select_obj)
            // return "今天";
            var mth = that.prev_select_obj.json["objectDate"].match(/(.*)-(.*)/);
            var selectDate = that.prev_select_obj !== null ? new Date(`${that.prev_select_obj.json.objectDate}-${that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["solarDate"]}\ 00:00:00`).valueOf():0;
            var todayDate = that.prev_select_obj !== null ? new Date(`${that._toMonth_.todayDate}\ 00:00:00`).valueOf():0;
            var distance = (selectDate - todayDate)/86400000;
            console.log("#68", `${that.prev_select_obj.json.objectDate}-${that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["solarDate"]}`, `${that._toMonth_.todayDate}`)
            console.log("#69", distance)
            return distance === 0 ? "今天" : (distance < 0 ? ( distance === -1 ? "昨天" : Math.abs(distance) + "天前") : ( distance === 1 ? "明天" : Math.abs(distance) + "天后"));
        }
    },
    "methods": {
        hideNav () {
            console.log("close");
            that.navIsShow = false;
            that.menuLeave = !that.menuLeave;
        },
        showNav () {
            that.menuLeave = !that.menuLeave;
            that.navIsShow = true;
        },
        getMonthDatesData () {
            var template = {

            }
        },
        forceSetUpdateTodayNum (data) {
            // this.$refs.calePanel.setTodayGrid(data)
        },
        makeDatesData (yyyyMM) {
            var now = new Date();
            var now_year = parseInt(now.format("yyyy"));
            var now_month = parseInt(now.format("MM"))
            var now_day = parseInt(now.format("dd"));
            var tar_year = yyyyMM.replace(/(.*)-(.*)/, "$1");
            var tar_month = yyyyMM.replace(/(.*)-(.*)/, "$2");
            var isTodayTip = now_year == parseInt(tar_year) && now_month === parseInt(tar_month);
            var frontSpace = new Date(`${tar_year}-${tar_month}`+"-01").getDay() - 1; // 日历当月月份前空天数
            var getMonthDayNum = function (_yyyy, _MM) {
                var d = new Date(_yyyy, _MM, 0);
                return d.getDate();
            };
            // console.log(tar_year, tar_month)
            var conributeToMonthDates = function (sy, sm, sd) {
                var lds = utils.sloarToLunar(sy, sm, sd);
                var tl = {
                    "solarDate": sd,
                    "lunarDate": lds.lunarDay,
                    "lunarMonth": lds.lunarMonth,
                    "isToday": sd === now_day && isTodayTip,
                    "isSelected": false,
                    "todayNotes": [""]
                };
                return tl;
            };
            var day_num = getMonthDayNum(tar_year, tar_month);
            // console.log(day_num);
            var tMDs = [];
            for(var i=0; i<day_num; i++){
                tMDs[i] = conributeToMonthDates(tar_year, tar_month, i+1);
            };
            return {
                "todayDate": now.format("yyyy-MM-dd"),
                "objectDate": yyyyMM,
                "toMonthFrontSpace": frontSpace,
                "toMonthDates": tMDs
            };
        },
        getTheMonth (theDate, distance=0) {
            var theYear = parseInt(theDate.replace(/(.*)-(.*)/, "$1")),
                theMonth = parseInt(theDate.replace(/(.*)-(.*)/, "$2"));
            var tot = theYear*12 + theMonth + distance;
            var cmp_year = 0, cmp_month = 0;

            var cmp_year = Math.floor(tot/12),
                cmp_month = tot%12;
            // console.log(new Date(`${cmp_year}-${cmp_month}`).format("yyyy-MM-01"));
            return new Date(`${cmp_year}-${cmp_month}`).format("yyyy-MM");
        },
        // setHeader (obj) {
        //     // var mth = that.dateData["todayDate"].match(/(.*)-(.*)-(.*)/);
        //     var o_year = obj.year;
        //     var o_month = obj.month;
        //     var o_day = obj.day;
        //     var distance = obj.distance;
        //     that.dateJSON = {
        //         "year": "2019",
        //         "month": "7",
        //         "day": "31",
        //         "isToday": distance === 0 ? "今天" : (distance < 0 ? ( distance === -1 ? "昨天" : Math.abs(distance) + "天前") : ( distance === 1 ? "明天" : Math.abs(distance) + "天后"))
        //     }
        // },
        selected (data) {
            // --- select highlight
            console.log("#154", data)
            that.prev_select_obj !== null && (that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["isSelected"] = false);
            data.json["toMonthDates"][data.idx-1]["isSelected"] = true;
            that.prev_select_obj = data;
            // that.prev_select.todayDate = data.json.objectDate;
            console.log("#160", data)
            //  --- select highlight

            // --- refresh panel
            console.log("tmp", data);
            var mth = data.json["objectDate"].match(/(.*)-(.*)/);
            // var selectDate = new Date(`${data.json.objectDate}-${data.json["toMonthDates"][data.idx-1]["solarDate"]}\ 00:00:00`).valueOf();
            // var todayDate = new Date(`${data.json.todayDate}\ 00:00:00`).valueOf();
            // var distance = (selectDate - todayDate)/86400000;
            // console.log(distance)
            that.dateJSON = {
                "year": parseInt(mth[1]),
                "month": parseInt(mth[2]),
                "day": data.json["toMonthDates"][data.idx-1]["solarDate"],
                // "isToday": distance === 0 ? "今天" : (distance < 0 ? ( distance === -1 ? "昨天" : Math.abs(distance) + "天前") : ( distance === 1 ? "明天" : Math.abs(distance) + "天后"))
            }
            // --- refresh panel
        },
        forceUpdateToday (yyyyMMdd) {
            var index = new Date(yyyyMMdd).format("yyyy-MM");
            var num = parseInt(new Date(yyyyMMdd).format("dd"));
            var range = {
                "prevDatesData": that.prevDatesData.objectDate,
                "centerDatesData": that.centerDatesData.objectDate,
                "nextDatesData": that.nextDatesData.objectDate,
            };
            var obj = {};
            for (var key in range) {
                if (index === range[key]) obj = that[key];
            }
            that._toMonth_["toMonthDates"][that.toDateDayNum-1].isToday = false;
            obj["toMonthDates"][num-1].isToday = true;
            console.log("#191", obj.todayDate);
            that._toMonth_.todayDate = new Date(yyyyMMdd).format("yyyy-MM-dd");
            // that.centerDatesData["toMonthDates"][num+1]["isToday"] = true;
            that.dateJSON = {
                "year": parseInt(new Date(yyyyMMdd).format("yyyy")),
                "month": parseInt(new Date(yyyyMMdd).format("MM")),
                "day": num,
                // "isToday": distance === 0 ? "今天" : (distance < 0 ? ( distance === -1 ? "昨天" : Math.abs(distance) + "天前") : ( distance === 1 ? "明天" : Math.abs(distance) + "天后"))
            }
        }
    },
    data () {
        return {
            "navIsShow": false,
            "menuLeave": true,
            "mdIco": {
                "cp": "vpn_key",
                "cr": "4082fc"
            },
            "week_order": ["一","二","三","四","五","六","日"],
            "prevDatesData": {},
            "centerDatesData": {},
            "_toMonth_": {},
            "nextDatesData": {},
            "prev_select": null,
            "prev_select_obj": null,
            "toDateDayNum": -1,
            "nowDate": 0,
            "dateJSON": {
                "year": "2019",
                "month": "7",
                "day": "31",
                "isToday": "今天"
            },
            "forceUpdateTodayNum": {
                "force": false,
                "num": -1
            }
        }
    },
    created () {
        that = this;
        var now_ = new Date();
        var now = now_.format("yyyy-MM")
        that.toDateDayNum = parseInt(now_.format("dd"));
        that.prevDatesData = that.makeDatesData(that.getTheMonth(now, -1));
        that.centerDatesData = that._toMonth_ =  that.makeDatesData(that.getTheMonth(now));
        that.prev_select_obj ={
            "idx": parseInt(now_.format("dd")),
            "json": that.makeDatesData(that.getTheMonth(now))
        }
        that.nextDatesData = that.makeDatesData(that.getTheMonth(now, 1));
        console.log(that.makeDatesData(that.getTheMonth(now, -1)), that.makeDatesData(that.getTheMonth(now, 0)), that.makeDatesData(that.getTheMonth(now, 1)))
        console.log("7899879", that.getTheMonth(now, -1))
        that.forceUpdateToday(now_.format("yyyy-MM-dd")) // 初始化设置今日时间
        setTimeout(function(){
            that.forceUpdateToday("2019-8-8")
        },500)
    },
    mounted () {
    }
}
</script>
<style>
.app-container{
    position: relative;
    padding: 12px 20px; 
    border-radius: 9px; 
    width: 75%; 
    max-width: 420px; min-width: 252px;
    box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .16);
    background-color: #fff;
    /* overflow: hidden; */
}
.menu-button{
    position: absolute;
    right: 0; top: 0;
    width: calc(100% - .5rem); height: 48px;
    padding-right: .5rem;
}
.nav{
    position: absolute; z-index: 2;
    top: 0; left: 0;
    height: 100%; width: 100%;
    background-color: none;
    background-color: rgba(14, 30, 37, .52);
    transition: opacity 200ms;
}
.nav.close{
    opacity: 0;
}
.nav > .icon-banner{
    width: calc(100% - 1rem); height: 48px;
    padding: 0 .5rem;
    background-color: #fff;
    overflow: hidden;
}
.slide-container{
    width:100%; height: auto;
    /* transform: translateX(100%) */
}
.slide-outer{
    width: 300%; height: auto;
    display: flex; flex-wrap: nowrap;
    margin-left: -100%;
}
.slide-item{
    min-height: 450px;
    width: 100%;
}
</style>

