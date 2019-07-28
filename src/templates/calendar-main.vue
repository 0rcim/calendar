// 日历主体框架组件
<template>
    <div class="app" ref="app" :class="{'flip': flip}">
        <div ref="calendar-object" class="app-container calendar" :class="{'edge': edge_hack_calendar}" v-show="Edge_Calendar_Show">
            <transition name="bounce">
                <div class="menu-button" v-if="menuLeave">
                    <touch-ripple :side="'right'" @event_click="showNav">
                        <md-ico :codepoint="'menu'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                </div>
            </transition>
            <transition name="fade">
                <div class="nav" v-if="navIsShow">
                    <div class="icon-banner">
                        <touch-ripple :side="'right'" @event_click="hideNav">
                            <md-ico :codepoint="'close'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'设置'">
                            <md-ico :codepoint="'more_horiz'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'添加今日便笺'">
                            <md-ico :codepoint="'add'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                    </div>
                </div>
            </transition>
            <cale-header :month="dateJSON.month" :day="dateJSON.day" :year="dateJSON.year" :isToday="isToday"></cale-header>
            <week-banner :arr="week_order"></week-banner>
            <chevron-btn :position="'left'" :chevronShow="left_show" @shown="left_fn" @hidden="left_fn_" @slideMonth="gotoPrevMonth"></chevron-btn>
            <div class="slide-container" :class="{'page0': page0, 'page2': page2, 'transition': page_transition}">
                <div class="slide-outer" :class="{'short': isShort, 'tall': !isShort}">
                    <div class="slide-item">
                        <!-- prev month -->
                        <dates-table :datesData="prevDatesData" @selected="selected" @edit="edit"></dates-table>
                    </div>
                    <div class="slide-item">
                        <!-- this month -->
                        <dates-table :datesData="centerDatesData" @selected="selected" @edit="edit"></dates-table>
                    </div>
                    <div class="slide-item">
                        <!-- next month -->
                        <dates-table :datesData="nextDatesData" @selected="selected" @edit="edit"></dates-table>
                    </div>
                </div>
            </div>
            <!-- body -->
            <chevron-btn :position="'right'" :chevronShow="right_show" @shown="right_fn" @hidden="right_fn_" @slideMonth="gotoNextMonth"></chevron-btn>
            <div class="backToday">
                <touch-ripple :side="'right'" @event_click="backToday" :title="'回到今天'">
                    <md-ico :codepoint="'today'" :color="'#ea5245'"></md-ico>
                </touch-ripple>
            </div>
        </div>
        <div ref="notepad-object" class="app-container notepad"  :class="{'edge': edge_hack_notepad}" v-show="Edge_Notepad_Show" :style="{'height': notepadHeight+'px'}">
            <transition name="fade">
                <div class="note-body" style="back">
                    <div class="icon-banner">
                        <touch-ripple :side="'right'" @event_click="calen" :theme="'green'" :disabled="edit_bools.check_disabled">
                            <md-ico :codepoint="'check'" :color="'#41b883'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'上一篇'" :disabled="edit_bools.back_disabled">
                            <md-ico :codepoint="'arrow_back'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'下一篇'" :disabled="edit_bools.forward_disabled">
                            <md-ico :codepoint="'arrow_forward'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'永久删除此条便笺'" :theme="'red'">
                            <md-ico :codepoint="'delete_forever'" :color="'#f44336'"></md-ico>
                        </touch-ripple>
                    </div>
                    <input-area ref="ia" @writing="writing" :title_show="title_show" @titling="titling"></input-area>
                    <div class="under-title">
                        <div class="build-time"><span v-text="buildTime"></span></div>
                        <div class="tags_options"><span><span>这一天</span>的<span>#1</span>便笺</span></div>
                        <div style="clear:both;"></div>
                    </div>
                    <text-area ref="ta" @writing="writing" :tip_id="tip_id"></text-area>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import utils from "../utils";
import { festivals } from "../../server/data/festivalsData";
utils.dateFormat();
utils.getComputedStyle();
// console.log(utils.sloarToLunar(2017, 6, 24));
// console.log(utils.getSolarTerm(2020, 9, 22));
// console.log(utils.getSolarTerm(2019, 9, 23));
// -----
console.log(utils.specialResolveSD("12第最后个Mon.", 2019))
// console.log(utils.getChuXi(1966))
// console.log(utils.getHanShi(1996))
console.log("dx", utils.getYearsSolarTerm(2020, "大雪"), utils.getSolarTerm(2019, 12, 7))
import mdIco from "./MdIco.vue";
import touchRipple from "./TouchRipple.vue";
import caleHeader from "./CaleHeader.vue";
import weekBanner from "./WeekBanner.vue";
import datesTable from "./DatesTable.vue";
import chevronBtn from "./ChevronButton.vue";
import inputArea from "./InputArea.vue";
import textArea from "./textArea.vue";
var that = null;
export default {
    "name": "calendarApp",
    "components": { mdIco , touchRipple , weekBanner, datesTable , caleHeader , chevronBtn , inputArea , textArea },
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
        },
        specialDates () {
            var spec = {
                "important": {},
                "normal": {}
            };
            for(let key in spec){
                for(let k in festivals.specials["ld"][key]){
                    var u = new Date(utils.specialResolveSD(k, that.sy)).format("yyyy/MM/dd");
                    spec[key][u] = festivals.specials["ld"][key][k];
                }
            }
            return spec;
        },
        // title_show () {
        //     console.log("A")
        //     return that.ia_val.length === 0 || that.ta_val.length === 0;
        // }
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
            var conributeToMonthDates = function (sy, sm, sd, i_) {
                var lds = utils.sloarToLunar(sy, sm, sd);
                var todayNotes = [
                    {
                        "id": "[2019-07-26]#"+i_,
                        "title": "....",
                        "update_time": "09:22",
                        "content": "yourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\nyourtexthere_thisisyourtextHere\n"
                    }
                ];
                var tl = {
                    "solarDate": sd,
                    "lunarDate": that.returnBottomLabel(sy, sm, sd, lds.lunarMonth, lds.lunarDay),
                    "lunarMonth": lds.lunarMonth,
                    "isToday": sd === now_day && isTodayTip,
                    "isSelected": false,
                    "todayNotes": todayNotes
                };
                return tl;
            };
            var day_num = getMonthDayNum(tar_year, tar_month);
            // var aq = new Promise((resolve, reject) => {
            //     utils.AjaxRequest.post({
            //         "url": "http://localhost:4321/getNotes",
            //         "queryString": utils.joint({
            //             "sy": now_year,
            //             "sm": now_month
            //         }),
            //         "onSuccess": function (req) {
            //             var data = JSON.parse(req.responseText);
            //             reject(data);
            //             console.log(now_year, now_month, data);
            //         }
            //     });
            // });
            // aq.then(function (data) {
            //     console.log(data)
            // });
            var tMDs = [];
            for(var i=0; i<day_num; i++){
                tMDs[i] = conributeToMonthDates(tar_year, tar_month, i+1, i+1);
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
        edit (data) {
            that.$refs["notepad-object"].style.visibility = "visible";
            if(window.Browser["Edge"] && !window.Browser["IE"]){ // 针对 Edge 翻转效果的问题作出改变
                that.flip = true;
                setTimeout(function(){
                    // that.edge_hack_notepad = true;
                    that.$refs["app"].innerHTML = "";
                    that.$refs["app"].appendChild(that.$refs["notepad-object"]);
                }, 600);
            }else{
                clearTimeout(that.edit_timer);
                that.flip = true;
                that.left_show = false;
                that.right_show = false;
                that.edit_timer = setTimeout(function () {
                    clearTimeout(that.edit_timer);
                }, 700)
            }
            var timestamp = new Date();
            that.buildTime = timestamp.format("hh:mm");
            var dayNotes = data.json.toMonthDates[data.idx].todayNotes; // Array
            that.ia_ele.focus()
            // console.log(that.$refs["ia"].$el.querySelector("input"))
            // console.log(that.$refs["ia"])
            that.ia_ele.value = that.ia_val = dayNotes[0].title;
            that.title_show = dayNotes[0].title.length === 0;
            that.ta_ele.value = that.ta_val = dayNotes[0].content;
            that.buildTime = dayNotes[0].update_time;
            that.tip_id = dayNotes[0].id;
            console.log(data)
        },
        calen (data) {
            if(window.Browser["Edge"] && !window.Browser["IE"]){ // 针对 Edge 翻转效果的问题作出改变
                that.flip = false;
                setTimeout(function(){
                    // that.edge_hack = true;
                    that.$refs["app"].innerHTML = "";
                    that.$refs["app"].appendChild(that.$refs["calendar-object"]);
                }, 600);
            }else{
                clearTimeout(that.edit_timer);
                that.edit_timer = setTimeout(function(){
                    that.flip = false;
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function(){
                        that.left_show = true;
                        that.right_show = true;
                        that.$refs["notepad-object"].style.visibility = "hidden";
                        clearTimeout(this.timer);
                    }, 1200);
                    clearTimeout(that.edit_timer);
                }, 100);
            };
            utils.AjaxRequest.post({
                "url": "http://localhost:4321/sendNotes",
                "queryString": utils.joint({
                    "id": that.tip_id,
                    "title": that.ia_ele.value,
                    "content": that.ta_ele.value,
                    "update_time": that.buildTime
                }),
                "onSuccess": function (req) {
                    console.log(req.responseText)
                },
                "onError": function (req) {
                    console.log(req.responseText)
                }
            })
            console.log(data);
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
            // var ChuXi = utils.getChuXi(sy);
            // var HanShi = utils.getHanShi(sy);
            // console.log(ChuXi, HanShi)
            that.sy = sy;
            if(festivals["important"]["ld"][lm] && festivals["important"]["ld"][lm][ld] && festivals["important"]["ld"][lm][ld].length < 5){
                return festivals["important"]["ld"][lm][ld];
            }else{
                if(festivals["important"]["sd"][int_m] && festivals["important"]["sd"][int_m][sd] && festivals["important"]["sd"][int_m][sd].length < 5){
                    return festivals["important"]["sd"][int_m][sd];
                }else{
                    if(festivals["normal"]["ld"][lm] && festivals["normal"]["ld"][lm][ld] && festivals["normal"]["ld"][lm][ld].length < 5){
                        return festivals["normal"]["ld"][lm][ld];
                    }else{
                        if(festivals["not-important"]["ld"][lm] && festivals["not-important"]["ld"][lm][ld] && festivals["not-important"]["ld"][lm][ld].length < 5){
                            return festivals["not-important"]["ld"][lm][ld];
                        }else{
                            // specialDates
                            if(that.specialDates["important"][new Date(sy, sm-1, sd).format("yyyy/MM/dd")]){
                                console.log(that.sy)
                                return that.specialDates["important"][new Date(sy, sm-1, sd).format("yyyy/MM/dd")];
                            }else{
                                // chuxi
                                if(utils.getChuXi(sy) === new Date(sy, sm-1, sd).format("yyyy/M/d")){
                                    return "除夕";
                                }else{
                                    if(utils.getHanShi(sy) ===  new Date(sy, sm-1, sd).format("yyyy/M/d")){
                                        return "寒食节";
                                    }else{
                                        if(utils.getSolarTerm(sy, parseInt(sm), sd)){
                                            return utils.getSolarTerm(sy, parseInt(sm), sd)
                                        }else{
                                            if(ld === "初一"){
                                                return lm + "月";
                                            }else{
                                                // hanshi
                                                if(festivals["not-important"]["sd"][int_m] && festivals["not-important"]["sd"][int_m][sd] && festivals["not-important"]["sd"][int_m][sd].length < 5){
                                                    return festivals["not-important"]["sd"][int_m][sd];
                                                }else{
                                                    if(festivals["normal"]["sd"][int_m] && festivals["normal"]["sd"][int_m][sd] && festivals["normal"]["sd"][int_m][sd].length < 5){
                                                        return festivals["normal"]["sd"][int_m][sd];
                                                    }else{
                                                        var tmp = that.specialDates["normal"][new Date(sy, sm-1, sd).format("yyyy/MM/dd")];
                                                        if (tmp && tmp.length < 5) {
                                                            that.sy = sy;
                                                            return that.specialDates["normal"][new Date(sy, sm-1, sd).format("yyyy/MM/dd")];
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
            that.page_transition = true;
            that.centerDatesGridsNum = that.prevDatesData.toMonthDates.length + that.prevDatesData.toMonthFrontSpace;
            clearTimeout(that.slideTimer);
            that.slideTimer = setTimeout(function () {
                that.page0 = false;
                that.page2 = false;
                that.page_transition = false;
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
            that.page_transition = true;
            that.centerDatesGridsNum = that.nextDatesData.toMonthDates.length + that.nextDatesData.toMonthFrontSpace;
            clearTimeout(that.slideTimer);
            that.slideTimer = setTimeout(function () {
                that.page0 = false;
                that.page2 = false;
                that.page_transition = false;
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
        set3pagesDates (center_yyyyMM_Is, fn) {
            // console.log("#273", center_yyyyMM_Is);
            var h = parseFloat(window.getComputedStyle(that.$refs["calendar-object"], "").getPropertyValue("height"));
            that.notepadHeight = h;
            that.prevDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, -1));
            that.centerDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is));
            that.nextDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, 1));
            fn && fn();
        },
        backToday () {
            /** that.prev_select_obj
             * {
             *  idx: Number
             *  json: {
             *      objectDate: "yyyy/MM",
             *      toMonthDates: <Array>,
             *      toMonthFrontSpace: Number,
             *      todayDate: "yyyy/MM/dd"
             *  }
             * }
             */
            /** that._toMonth_{
             *      objectDate: "yyyy/MM",
             *      toMonthDates: <Array>,
             *      toMonthFrontSpace: Number,
             *      todayDate: "yyyy/MM/dd"
             *  }
             */
            var distanceFromToday = new Date(`${that.prev_select_obj.json.objectDate}/01`) - new Date(`${that._toMonth_.objectDate}/01`);
            var today_idx = parseInt(new Date(that._toMonth_.todayDate).format("d"));
            var today_GridsNum = that._toMonth_.toMonthDates.length + that._toMonth_.toMonthFrontSpace;
            if(distanceFromToday===0){ // toMonth
                // ---
            }else if(distanceFromToday < 0){ // previous // 滑至page2
                that.nextDatesData = that.makeDatesData(that._toMonth_.objectDate);
                that.page0 = false;
                that.page2 = true;
                that.page_transition = true;
                that.centerDatesGridsNum = today_GridsNum;
                setTimeout(function(){
                    that.page0 = false;
                    that.page2 = false;
                    that.page_transition = false;
                    that.set3pagesDates(that._toMonth_.objectDate);
                    that.display_yyyyMMdd = that._toMonth_.todayDate;
                    that.prev_select_obj = {
                        idx: today_idx,
                        json: that._toMonth_
                    }
                    that.selected(that.prev_select_obj);
                }, 400);
            }else{ // future // 滑动至page1
                that.prevDatesData = that.makeDatesData(that._toMonth_.objectDate);
                that.page0 = true;
                that.page2 = false;
                that.page_transition = true;
                that.centerDatesGridsNum = today_GridsNum;
                setTimeout(function(){
                    that.page0 = false;
                    that.page2 = false;
                    that.page_transition = false;
                    that.set3pagesDates(that._toMonth_.objectDate);
                    that.display_yyyyMMdd = that._toMonth_.todayDate;
                    that.prev_select_obj = {
                        idx: today_idx,
                        json: that._toMonth_
                    }
                    that.selected(that.prev_select_obj);
                }, 400);
            }
            console.log(distanceFromToday);
            console.log(that.prev_select_obj)
            console.log(that._toMonth_)
        },
        titling (e) {
            var val = e.target.value;
            that.ia_val = val;
            that.title_show = val.length === 0;
            that.edit_bools.check_disabled = that.ta_val.length === 0 && val.length === 0;
            // console.log(val.length, that.title_show)
            // that.edit_bools.check_disabled = val.length === 0;
            // that.edit_bools.back_disabled = val.length === 0;
        },
        writing (e) {
            var val = e.target.value;
            that.ta_val = val;
            that.edit_bools.check_disabled = that.ia_val.length === 0 && val.length === 0;
            // console.log(val)
            // that.edit_bools.check_disabled = val.length === 0;
            // that.edit_bools.back_disabled = val.length === 0;
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
            "sy": 2020,
            "left_show": true,
            "right_show": true,
            "page0": false,
            "page2": false,
            "page_transition": true,
            "display_yyyyMMdd": "",
            "centerDatesGridsNum": 0,
            "notepadHeight": -1,
            "flip": false,
            edge_hack_calendar: false,
            edge_hack_notepad: false,
            Edge_Calendar_Show: true,
            Edge_Notepad_Show: true,
            buildTime: "",
            edit_bools: {
                check_disabled: true,
                back_disabled: true,
                forward_disabled: true
            },
            title_show: true,
            tip_id: "",
            ia_val: "",
            ta_val: ""
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
            "json": that._toMonth_
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
        var h = parseFloat(window.getComputedStyle(that.$refs["calendar-object"], "").getPropertyValue("height"));
        that.notepadHeight = h;
        window.Browser = utils.getBroswerType();
        that.ia_ele = that.$refs["ia"].$el.querySelector("input");
        that.ta_ele = that.$refs["ta"].$el.querySelector("textarea");
    }
}
</script>
<style>
.app{
    position: relative;
    display: flex; justify-content: center; align-items: center;
    width: 75%; 
    max-width: 440px; min-width: 252px;
    height: 100%;
    max-height: 540px;
    transform: scale(1);
    perspective: 1920px;
    -webkit-perspective: 1920px;
    -moz-perspective: 1920px;
}
.app-container{
    position: absolute; top: 0; left: 0;
    padding: 12px 20px; 
    border-radius: 9px; 
    box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .16);
    background-color: #fff;
    overflow: hidden;
    /* height: calc(100% - 24px); width: calc(100% - 40px); */
    /* max-height: 540px; */
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    -moz-transform-style: preserve-3d;
    transition: 1.2s ease-in-out;
    -webkit-transition: 1.2s ease-in-out;
    -moz-transition:  1.2s ease-in-out;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
}
.app-container.calendar{
    z-index: 2;
    width: calc(100% - 40px);
    transform: rotateY(0) scale(1);
    -webkit-transform: rotateY(0) scale(1);
    -moz-transform: rotateY(0) scale(1);
    -ms-transform: rotateY(0) scale(1);
}
.app.flip .app-container.calendar{
    transform: rotateY(-180deg) scale(.4);
    -webkit-transform: rotateY(-180deg) scale(.4);
    -moz-transform: rotateY(-180deg) scale(.4);
    -ms-transform: rotateY(-180deg) scale(.4);
}
.app-container.notepad{
    width: calc(100% - 40px);
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .16);
    transform: rotateY(180deg) scale(.4);
    -webkit-transform: rotateY(180deg) scale(.4);
    -moz-transform: rotateY(180deg) scale(.4);
    -ms-transform: rotateY(180deg) scale(.4);
    z-index: 1;
}
.app.flip .app-container.notepad{
    transform: rotateY(0) scale(1);
    -webkit-transform: rotateY(0) scale(1);
    -moz-transform: rotateY(0) scale(1);
    -ms-transform: rotateY(0) scale(1);
}
@keyframes notepad_flip {
    from{transform: rotateY(180deg) scale(.4);}
    to{transform: rotateY(0) scale(1);}
}
.menu-button{
    position: absolute;
    right: 0; top: 0;
    width: calc(100% - .5rem); height: 48px;
    padding-right: .5rem;
}
.nav, .note-body{
    position: absolute; z-index: 3;
    top: 0; left: 0;
    height: 100%; width: 100%;
    background-color: none;
    background-color: rgba(14, 30, 37, .52);
    transition: opacity 200ms;
}
.note-body{
    background-color: #fff;
}
.nav.close{
    opacity: 0;
}
.nav > .icon-banner, .note-body > .icon-banner{
    width: calc(100% - 1rem); height: 48px;
    padding: 0 .5rem;
    background-color: #fff;
    overflow: hidden;
}
.note-body > .icon-banner{
    overflow: initial;
    position: relative; z-index: 3;
}
.slide-container{
    width:100%; height: auto;
    /* overflow: hidden; */
    /* 0 */
    /* transform: translateX(100%); */ 
    /* 2 */
    /* transform: translateX(-100%); */
}
.slide-container.transition{
    transition: transform 400ms;
}
.slide-container.page0{
    transform: translateX(100%);
}
.slide-container.page2{
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
.under-title{
    padding: 5px 1rem;
    font-size: 1rem;
}
.under-title .build-time{
    color: #bbb;
    font-size: 14px;
    letter-spacing: .025rem;
    float: left;
}
.under-title .tags_options{
    color: #bbb;
    font-size: 14px;
    letter-spacing: .025rem;
    float: right;
}
</style>

