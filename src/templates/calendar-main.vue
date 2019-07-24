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
        <chevron-btn :position="'left'" :chevronShow="left_show" @shown="left_fn" @hidden="left_fn_" @slideMonth="gotoPrevMonth"></chevron-btn>
        <div class="slide-container" :class="{'page0': page0, 'page2': page2}">
            <div class="slide-outer" :class="{'short': isShort, 'tall': !isShort}">
                <div class="slide-item">
                    <!-- prev month -->
                    <dates-table :datesData="prevDatesData" @selected="selected"></dates-table>
                </div>
                <div class="slide-item">
                    <!-- this month -->
                    <dates-table :datesData="centerDatesData" @selected="selected"></dates-table>
                </div>
                <div class="slide-item">
                    <!-- next month -->
                    <dates-table :datesData="nextDatesData" @selected="selected"></dates-table>
                </div>
            </div>
        </div>
        <!-- body -->
        <chevron-btn :position="'right'" :chevronShow="right_show" @shown="right_fn" @hidden="right_fn_" @slideMonth="gotoNextMonth"></chevron-btn>
        <div class="backToday" :title="'回到今天'">
            <touch-ripple :side="1" @event_click="backToday">
                <md-ico :codepoint="'today'" :color="'#ea5245'"></md-ico>
            </touch-ripple>
        </div>
    </div>
</template>
<script>
import utils from "../utils";
import { festivals } from "../server/data/festivalsData";
utils.dateFormat();
// console.log(utils.sloarToLunar(2017, 6, 24));
// console.log(utils.getSolarTerm(2020, 9, 22));
// console.log(utils.getSolarTerm(2019, 9, 23));
// -----
// console.log(utils.specialResolveSD("2第4个Thu.", 2019))
// console.log(utils.getChuXi(1966))
// console.log(utils.getHanShi(1996))
// console.log(utils.getYearsSolarTerm(2019, "小暑"))
import mdIco from "./MdIco.vue";
import touchRipple from "./TouchRipple.vue";
import caleHeader from "./CaleHeader.vue";
import weekBanner from "./WeekBanner.vue";
import datesTable from "./DatesTable.vue";
import chevronBtn from "./ChevronButton.vue";
var that = null;
export default {
    "name": "calendarApp",
    "components": { mdIco , touchRipple , weekBanner, datesTable , caleHeader , chevronBtn },
    "computed": {
        isToday () {
            var mth = that.prev_select_obj.json["objectDate"].match(/(.*)\/(.*)/);
            var selectDate = that.prev_select_obj !== null ? new Date(`${that.prev_select_obj.json.objectDate}/${that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["solarDate"]}\ 00:00:00`).valueOf():0;
            var todayDate = that.prev_select_obj !== null ? new Date(`${that._toMonth_.todayDate}\ 00:00:00`).valueOf():0;
            var distance = (selectDate - todayDate)/86400000;
            return distance === 0 ? "今天" : (distance < 0 ? ( distance === -1 ? "昨天" : Math.abs(distance) + "天前") : ( distance === 1 ? "明天" : Math.abs(distance) + "天后"));
        },
        isShort () {
            return that.centerDatesGridsNum <= 35;
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
        makeDatesData (yyyyMM) {
            var now = new Date();
            var now_year = parseInt(now.format("yyyy"));
            var now_month = parseInt(now.format("MM"))
            var now_day = parseInt(now.format("dd"));
            var tar_year = yyyyMM.replace(/(.*)\/(.*)/, "$1");
            var tar_month = yyyyMM.replace(/(.*)\/(.*)/, "$2");
            var isTodayTip = now_year == parseInt(tar_year) && now_month === parseInt(tar_month);
            var weekNum = new Date(`${tar_year}/${tar_month}`+"/01").getDay();
            var frontSpace = weekNum === 0 ? 6 : weekNum - 1; // 日历当月月份前空天数
            var getMonthDayNum = function (_yyyy, _MM) {
                var d = new Date(_yyyy, _MM, 0);
                return d.getDate();
            };
            var conributeToMonthDates = function (sy, sm, sd) {
                var lds = utils.sloarToLunar(sy, sm, sd);
                var tl = {
                    "solarDate": sd,
                    "lunarDate": that.returnBottomLabel(sy, sm, sd, lds.lunarMonth, lds.lunarDay),
                    "lunarMonth": lds.lunarMonth,
                    "isToday": sd === now_day && isTodayTip,
                    "isSelected": false,
                    "todayNotes": [""]
                };
                return tl;
            };
            var day_num = getMonthDayNum(tar_year, tar_month);
            var tMDs = [];
            for(var i=0; i<day_num; i++){
                tMDs[i] = conributeToMonthDates(tar_year, tar_month, i+1);
            };
            return {
                "todayDate": now.format("yyyy/MM/dd"),
                "objectDate": yyyyMM,
                "toMonthFrontSpace": frontSpace,
                "toMonthDates": tMDs
            };
        },
        getTheMonth (theDate, distance=0) {
            var theYear = parseInt(theDate.replace(/(.*)\/(.*)/, "$1")),
                theMonth = parseInt(theDate.replace(/(.*)\/(.*)/, "$2"));
            var tot = theYear*12 + theMonth + distance;
            var cmp_year = 0, cmp_month = 0;

            var cmp_year = Math.floor((tot-1)/12),
                cmp_month = (tot%12+11)%12+1;
            return new Date(`${cmp_year}/${cmp_month}/1\ 00:00:00`).format("yyyy/MM");
        },
        selected (data) {
            // --- select highlight
            // console.log("#154", data)
            that.prev_select_obj !== null && (that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["isSelected"] = false);
            data.json["toMonthDates"][data.idx-1]["isSelected"] = true;
            that.prev_select_obj = data;
            // console.log("#160", data)
            //  --- select highlight

            // --- refresh panel
            // console.log("tmp", data);
            var mth = data.json["objectDate"].match(/(.*)\/(.*)/);
            that.dateJSON = {
                "year": parseInt(mth[1]),
                "month": parseInt(mth[2]),
                "day": data.json["toMonthDates"][data.idx-1]["solarDate"],
            }
            // --- refresh panel
        },
        forceUpdateToday (yyyyMMdd) {
            var index = new Date(yyyyMMdd).format("yyyy/MM");
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
            // console.log("#191", obj.todayDate);
            that._toMonth_.todayDate = new Date(yyyyMMdd).format("yyyy/MM/dd");
            that.dateJSON = {
                "year": parseInt(new Date(yyyyMMdd).format("yyyy")),
                "month": parseInt(new Date(yyyyMMdd).format("MM")),
                "day": num
            }
        },
        returnBottomLabel (sy, sm, sd, lm, ld) {
            let int_y = parseInt(sy), int_m = parseInt(sm);
            // console.log("#194", lm, ld)
            // return ld === '初一' ? lm + '月' : ld;
            if(festivals["important"]["ld"][lm] && festivals["important"]["ld"][lm][ld] && festivals["important"]["ld"][lm][ld].length < 5){
                return festivals["important"]["ld"][lm][ld];
            }else{
                if(festivals["not-important"]["ld"][lm] && festivals["not-important"]["ld"][lm][ld] && festivals["not-important"]["ld"][lm][ld].length < 5){
                    return festivals["not-important"]["ld"][lm][ld];
                }else{
                    if(festivals["normal"]["ld"][lm] && festivals["normal"]["ld"][lm][ld] && festivals["normal"]["ld"][lm][ld].length < 5){
                        return festivals["normal"]["ld"][lm][ld];
                    }else{
                        if(festivals["important"]["sd"][int_m] && festivals["important"]["sd"][int_m][sd] && festivals["important"]["sd"][int_m][sd].length < 5){
                            // console.log("#199", festivals["important"]["sd"][int_m][sd]);
                            return festivals["important"]["sd"][int_m][sd];
                        }else{
                            if(ld === "初一"){
                                return lm + "月"
                            }else{
                                if(utils.getSolarTerm(sy, sm, sd)){
                                    return utils.getSolarTerm(sy, sm, sd)
                                }else{
                                    if(festivals["not-important"]["sd"][int_m] && festivals["not-important"]["sd"][int_m][sd] && festivals["not-important"]["sd"][int_m][sd].length < 5){
                                        return festivals["not-important"]["sd"][int_m][sd];
                                    }else{
                                        if(festivals["normal"]["sd"][int_m] && festivals["normal"]["sd"][int_m][sd] && festivals["normal"]["sd"][int_m][sd].length < 5){
                                            return festivals["normal"]["sd"][int_m][sd];
                                        }else{
                                            return ld;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        hideShowBoth (bool) {
            this.left_show = bool;
            this.right_show = bool;
        },
        left_fn (data) {
            clearTimeout(that.timer);
            that.hideShowBoth(true);
        },
        left_fn_ (data) {
            clearTimeout(that.timer);
            that.timer = setTimeout(function () {
                that.hideShowBoth(false);
                clearTimeout(that.timer);
            }, 2000);
        },
        right_fn (data) {
            clearTimeout(that.timer);
            that.hideShowBoth(true);
        },
        right_fn_ (data) {
            clearTimeout(that.timer);
            that.timer = setTimeout(function () {
                that.hideShowBoth(false);
                clearTimeout(that.timer);
            }, 2000);
        },
        gotoPrevMonth (data) {
            // console.log("上月");
            that.page0 = true;
            that.page2 = false;
            that.centerDatesGridsNum = that.prevDatesData.toMonthDates.length + that.prevDatesData.toMonthFrontSpace;
            clearTimeout(that.slideTimer);
            that.slideTimer = setTimeout(function () {
                that.page0 = false;
                that.page2 = false;
                var prevMonth = that.getTheMonth(new Date(that.display_yyyyMMdd).format("yyyy/MM"), -1);
                that.set3pagesDates(prevMonth);
                // console.log("prevMonth", prevMonth)
                var selectFirstDay = prevMonth == that._toMonth_.todayDate ? new Date(that._toMonth_.todayDate).format("yyyy/MM") : "01";
                that.display_yyyyMMdd = `${prevMonth}/${selectFirstDay}`;
                that.prev_select_obj.json = that.centerDatesData;
                if(prevMonth == new Date(that._toMonth_.todayDate).format("yyyy/MM")) {
                    that.prev_select_obj.json.toMonthDates[0].isSelected = false;
                    that.prev_select_obj.idx = parseInt(new Date(that._toMonth_.todayDate).format("dd"));
                }else{
                    that.prev_select_obj.idx = 1;
                }
                that.selected(that.prev_select_obj);
                clearTimeout(that.slideTimer);
            }, 400);
        },
        gotoNextMonth (data) {
            // console.log("下月");
            that.page0 = false;
            that.page2 = true;
            that.centerDatesGridsNum = that.nextDatesData.toMonthDates.length + that.nextDatesData.toMonthFrontSpace;
            clearTimeout(that.slideTimer);
            that.slideTimer = setTimeout(function () {
                that.page0 = false;
                that.page2 = false;
                var nextMonth = that.getTheMonth(new Date(that.display_yyyyMMdd).format("yyyy/MM"), 1);
                that.set3pagesDates(nextMonth);
                var selectFirstDay = nextMonth == that._toMonth_.todayDate ? new Date(that._toMonth_.todayDate).format("yyyy/MM") : "01";
                that.display_yyyyMMdd = `${nextMonth}/${selectFirstDay}`;
                that.prev_select_obj.json = that.centerDatesData;
                if(nextMonth == new Date(that._toMonth_.todayDate).format("yyyy/MM")) {
                    that.prev_select_obj.json.toMonthDates[0].isSelected = false;
                    that.prev_select_obj.idx = parseInt(new Date(that._toMonth_.todayDate).format("dd"));
                }else{
                    that.prev_select_obj.idx = 1;
                }
                that.selected(that.prev_select_obj);
                clearTimeout(that.slideTimer);
            }, 400);
        },
        set3pagesDates (center_yyyyMM_Is) {
            // console.log("#273", center_yyyyMM_Is);
            that.prevDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, -1));
            that.centerDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is));
            that.nextDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, 1));
        },
        backToday () {

        }
    },
    data () {
        return {
            "navIsShow": false,
            "menuLeave": true,
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
            "left_show": true,
            "right_show": true,
            "page0": false,
            "page2": false,
            "display_yyyyMMdd": "",
            "centerDatesGridsNum": 0 
        }
    },
    beforeCreate () {
        console.log("creating!")
    },
    created () {
        that = this;
        var now_ = new Date();
        var now = now_.format("yyyy/MM")
        that.toDateDayNum = parseInt(now_.format("dd"));
        // console.log("#237", that.getTheMonth(now, -1))
        that.prevDatesData = that.makeDatesData(that.getTheMonth(now, -1));
        that.centerDatesData = that._toMonth_ =  that.makeDatesData(that.getTheMonth(now));
        that.prev_select_obj ={
            "idx": parseInt(now_.format("dd")),
            "json": that.makeDatesData(that.getTheMonth(now))
        }
        that.nextDatesData = that.makeDatesData(that.getTheMonth(now, 1));
        // console.log(that.makeDatesData(that.getTheMonth(now, -1)), that.makeDatesData(that.getTheMonth(now, 0)), that.makeDatesData(that.getTheMonth(now, 1)))
        that.forceUpdateToday(now_.format("yyyy/MM/dd")) // 初始化设置今日时间
        that.display_yyyyMMdd = now_.format("yyyy/MM/dd");
        // that.forceUpdateToday("2019/7/31")
        // setTimeout(function(){
        //     that.forceUpdateToday("2019-8-8") //测试
        // },500)
        setTimeout(function () {
            that.left_show = false;
            that.right_show = false;
        }, 1000)
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
    overflow: hidden;
}
.menu-button{
    position: absolute;
    right: 0; top: 0;
    width: calc(100% - .5rem); height: 48px;
    padding-right: .5rem;
}
.nav{
    position: absolute; z-index: 3;
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
    /* overflow: hidden; */
    /* 0 */
    /* transform: translateX(100%); */ 
    /* 2 */
    /* transform: translateX(-100%); */
}
.slide-container.page0{
    transition: transform 400ms;
    transform: translateX(100%);
}
.slide-container.page2{
    transition: transform 400ms;
    transform: translateX(-100%);
}
.slide-outer{
    width: 300%; height: 423px;
    /* 423 / 498 px */
    display: flex; flex-wrap: nowrap;
    margin-left: -100%;
    transition: height 200ms ease-in-out;
    will-change: height;
}
.slide-outer.short{
    height: 423px;
}
.slide-outer.tall{
    height: 498px;
}
.slide-outer .slide-item:not(:nth-child(2)){
    pointer-events: none;
    opacity: 0;
}
.slide-container.page0 .slide-outer .slide-item:not(:nth-child(2)), .slide-container.page2 .slide-outer .slide-item:not(:nth-child(2)){
    opacity: 1;
}
.slide-item{
    min-height: 450px;
    width: 100%;
    transition: opacity 100ms;
}
.backToday{
    position: absolute; right: 5px; bottom: 5px; z-index: 2;
}
.backToday .ico-outer{
    padding: 0;
}
</style>

