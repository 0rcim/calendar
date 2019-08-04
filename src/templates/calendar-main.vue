// 日历主体框架组件
<template>
    <div class="app" ref="app" :class="{'flip': flip}" :style="{'visibility': APP}">
        <div ref="calendar-object" class="app-container calendar" :class="{'edge': edge_hack_calendar}" v-show="Edge_Calendar_Show">
            <transition name="fade">
                <div class="menu-button" v-if="menuLeave">
                    <touch-ripple :side="'right'" @event_click="showNav">
                        <md-ico :codepoint="'menu'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                    <touch-ripple :side="'right'" :title="'添加今日便笺'" @event_click="add_today_notes">
                        <md-ico :codepoint="'add'" :color="'#ea5245'"></md-ico>
                    </touch-ripple>
                </div>
            </transition>
            <transition name="fade">
                <div class="nav" v-if="navIsShow">
                    <div class="icon-banner">
                        <div class="calen-header">
                            <span v-text="calen_header">此处标题</span>
                        </div>
                        <touch-ripple :side="'right'" @event_click="hideNav">
                            <md-ico :codepoint="'close'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'right'" @event_click="show_tip" :title="'关于此页'" v-show="tip_isShow">
                            <md-ico :codepoint="'help_outline'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <transition name="offset">
                            <touch-ripple :side="'right'" @event_click="delete_selected" v-show="delete_selected_btn_isShow" :title="'删除所选项'">
                                <md-ico :codepoint="'delete_forever'" :color="'#ea5245'"></md-ico>
                            </touch-ripple>
                        </transition>
                        <transition name="offset">
                            <touch-ripple :side="'left'" @event_click="back_to_sy_sm" v-show="back_to_sy_sm_btn_isShow" :title="'回至月份归档'">
                                <md-ico :codepoint="'arrow_back'" :color="'#ea5245'"></md-ico>
                            </touch-ripple>
                        </transition>
                        <touch-ripple :side="'left'" @event_click="sel_show_hide">
                            <md-ico :codepoint="'more_horiz'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                    </div>
                    <div class="container">
                        <div class="sel-mask" @click="sel_mask_click" v-show="sel_show"></div>
                        <div class="inner-slide-container">
                            <transition name="fade">
                                <div class="year-banner-displayer" v-if="bottom_displayer" @click="backToMonth">
                                    <div class="screen"><span v-text="screen"></span></div>
                                </div>
                            </transition>
                            <transition name="scale">
                                <div class="inner-slide-item" v-show="isi_control_bool[0]">
                                    <!-- pageName (sy_sm || sd) -->
                                    <viewall-notes ref="viewall-notes" :sy_sm_arr="viewall_arr"></viewall-notes>
                                </div>
                            </transition>
                            <transition name="scale">
                                <div class="inner-slide-item" v-show="isi_control_bool[1]" @scroll="yearday_scroll">
                                    <yearday-list ref="yearday-list"></yearday-list>
                                </div>
                            </transition>
                            <transition name="scale">
                                <div class="inner-slide-item" v-show="isi_control_bool[2]">
                                    <static-settings></static-settings>
                                </div>
                            </transition>
                            <transition name="scale">
                                <div class="inner-slide-item" v-show="isi_control_bool[3]">
                                    <static-help></static-help>
                                </div>
                            </transition>
                        </div>
                    </div>
                    <transition name="offset">
                        <selection-list v-show="sel_show"></selection-list>
                    </transition>
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
                        <touch-ripple :side="'right'" @event_click="calen" :theme="'green'">
                            <md-ico :codepoint="'exit_to_app'" :color="'#41b883'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'上一篇'" :disabled="back_disabled" @event_click="back">
                            <md-ico :codepoint="'arrow_back'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <touch-ripple :side="'left'" :title="'下一篇'" :disabled="forward_disabled" @event_click="forward">
                            <md-ico :codepoint="'arrow_forward'" :color="'#ea5245'"></md-ico>
                        </touch-ripple>
                        <!-- <touch-ripple :side="'left'" :title="'永久删除此条便笺'" :theme="'red'" @event_click="delete_forever">
                            <md-ico :codepoint="'delete_forever'" :color="'#f44336'"></md-ico>
                        </touch-ripple> -->
                    </div>
                    <input-area ref="ia" @writing="writing" :title_show="title_show" @titling="titling"></input-area>
                    <div class="under-title">
                        <div class="build-time"><span v-text="buildTime"></span></div>
                        <div class="tags_options"><span><span>这一天</span>的<span class="note_order_class" v-text="note_order">#1</span>便笺</span></div>
                        <div style="clear:both;"></div>
                    </div>
                    <text-area ref="ta" @writing="writing" :tip_id="tip_id"></text-area>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import utils, { joint } from "../utils";
import { festivals } from "../../server/data/festivalsData";
utils.dateFormat();
utils.getComputedStyle();
import mdIco from "./MdIco.vue";
import touchRipple from "./TouchRipple.vue";
import caleHeader from "./CaleHeader.vue";
import weekBanner from "./WeekBanner.vue";
import datesTable from "./DatesTable.vue";
import chevronBtn from "./ChevronButton.vue";
import inputArea from "./InputArea.vue";
import textArea from "./textArea.vue";
import selectionList from "./SelectionList.vue";
import viewallNotes from "./ViewallNotes.vue";
import yeardayList from "./YeardayList.vue";
// --- static templates --- //
import staticSettings from "./static/StaticSettings.vue";
import staticHelp from "./static/StaticHelp.vue";
var that = null;
export default {
    "name": "calendarApp",
    "components": { 
        mdIco , touchRipple , weekBanner, 
        datesTable , caleHeader , chevronBtn , 
        inputArea , textArea , selectionList ,
        staticHelp, viewallNotes , yeardayList ,
        staticSettings
    },
    "computed": {
        queriedFestivalTable () {
            let result = utils.queryFestival(new Date().format("yyyy")*1, festivals, that.queryList);
            that.$refs["yearday-list"] && (that.$refs["yearday-list"].fullYearFes = result);
            return result;
        },
        week_order () {
            let weeks = ["一","二","三","四","五","六","日"];
            that.startWeekOn === "周日" && weeks.pop() && weeks.unshift("日");
            return weeks;
        },
        isi_control_bool () {
            var empty = [];
            for(var x=0; x<that.isi.item_tot-1; empty[x++]=false);
            empty.splice(that.isi.active_page, 0, true);
            return empty;
        },
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
                for(let k in festivals.specials["sd"][key]){
                    var u = new Date(utils.specialResolveSD(k, that.sy)).format("yyyy/MM/dd");
                    spec[key][u] = festivals.specials["sd"][key][k];
                }
            }
            return spec;
        },
        back_disabled () {
            return that.selectedDayNotesPage === 0;
        },
        forward_disabled () {
            return that.selectedDayNotesPage >= that.selectedDayNotes.length-1;
        },
        note_order () {
            return `#${that.tip_id.split("#")[1]}`
        },
        delete_selected_btn_isShow () {
            return !!that.selected_notes_arr_length;
        }
    },
    "methods": {
        yearday_scroll () {
            that.bottom_displayer = false;
            clearTimeout(that.scroll_timer);
            that.scroll_timer = setTimeout(()=>{
                that.bottom_displayer = true;
            }, 250);
        },
        backToMonth () {
            that.$refs["yearday-list"].backToMonth();
        },
        show_tip () {
            window.dia.setData({
                "dia_isShow": true,
                "dia_title": "功能页介绍",
                "dia_content": `<p>本年一览，此页面以小方格的形式标注了本年的所有日期，特殊事件或节日用红圈标注出。</p><p>点击小方格即可在左下红框中查看当日信息。单击红框即可回到本月。节日信息显示程度可在设置中调整。</p>`,
                "dia_footer": [
                    {
                        "label": "知道啦",
                        fn () {
                            window.dia.setData("dia_isShow", false);
                        }
                    }
                ]
            })
        },
        sel_show_hide () {
            that.sel_show = !that.sel_show;
        },
        sel_mask_click () {
            that.sel_show = false;
        },
        add_today_notes () {
            that.$refs["notepad-object"].style.visibility = "visible";
            that.selectedDayNotes = [];
            that.selectedDayNotesPage = 0; // 禁用左右前进返回
            var n_date = new Date();
            that.ia_ele.focus();
            that.ia_ele.value = that.ia_val = "";
            that.title_show = that.ia_val.length === 0;
            that.ta_ele.value = that.ta_val = "";
            that.buildTime = n_date.format("hh:mm");
            that.tip_id = `[${n_date.format("yyyy-MM-dd")}]#${that._toMonth_.toMonthDates[that.toDateDayNum-1].todayNotes.filter((x)=>{return x!==null;}).length+1}`;
            that.adding_today_notes = true;
            // 确定新建的 Notes 的序列 #~
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
            };
        },
        hideNav () {
            that.navIsShow = false;
            that.menuLeave = !that.menuLeave;
            that.set3pagesDates(that.centerDatesData.objectDate)
            that.back_to_sy_sm();
            that.isi.active_page = 1;
            that.calen_header = "本年一览"
        },
        showNav () {
            that.menuLeave = !that.menuLeave;
            that.navIsShow = true;
        },
        makeDatesData (yyyyMM, datesData="centerDatesData") {
            var now = new Date();
            var now_year = parseInt(now.format("yyyy"));
            var now_month = parseInt(now.format("MM"))
            var now_day = parseInt(now.format("dd"));
            var tar_year = yyyyMM.replace(/(.*)\/(.*)/, "$1");
            var tar_month = yyyyMM.replace(/(.*)\/(.*)/, "$2");
            var isTodayTip = now_year == parseInt(tar_year) && now_month === parseInt(tar_month);
            var weekNum = new Date(`${tar_year}/${tar_month}`+"/01").getDay();
            // var frontSpace =  0 ? 6 : weekNum - 1; // 日历当月月份前空天数
            var frontSpace = that.startWeekOn === "周日" ? weekNum : (weekNum === 0 ? 6 : weekNum - 1);
            var getMonthDayNum = function (_yyyy, _MM) {
                var d = new Date(_yyyy, _MM, 0);
                return d.getDate();
            };
            var conributeToMonthDates = function (sy, sm, sd, i_) {
                var lds = utils.sloarToLunar(sy, sm, sd);
                var tl = {
                    "solarDate": sd,
                    "lunarDate": that.returnBottomLabel(sy, sm, sd, lds.lunarMonth, lds.lunarDay),
                    "lunarMonth": lds.lunarMonth,
                    "isToday": sd === now_day && isTodayTip,
                    "isSelected": false,
                    "todayNotes": []
                };
                return tl;
            };
            var day_num = getMonthDayNum(tar_year, tar_month);
            utils.AjaxRequest.post({
                "url": "http://localhost:4321/getNotes",
                "queryString": utils.joint({
                    "sy": tar_year,
                    "sm": tar_month
                }),
                "onSuccess": function (req) {
                    var data = JSON.parse(req.responseText);
                    // that.
                    for(var dayNote in data){
                        that[datesData]["toMonthDates"][parseInt(dayNote)-1]["todayNotes"] = data[dayNote]
                    }
                    return data;
                }
            });
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
            that.prev_select_obj !== null && (that.prev_select_obj.json["toMonthDates"][that.prev_select_obj.idx-1]["isSelected"] = false);
            data.json["toMonthDates"][data.idx-1]["isSelected"] = true;
            that.prev_select_obj = data;
            //  --- select highlight

            // --- refresh panel
            var mth = data.json["objectDate"].match(/(.*)\/(.*)/);
            that.dateJSON = {
                "year": parseInt(mth[1]),
                "month": parseInt(mth[2]),
                "day": data.json["toMonthDates"][data.idx-1]["solarDate"],
            }
            // --- refresh panel
        },
        edit (data) {
            that.adding_today_notes = false;
            var dayNotes = data.json.toMonthDates[parseInt(data.idx)-1].todayNotes.filter((x)=>{
                return x!==null;
            }); // Array
            if(dayNotes.length === 0) return; // 所选日无便笺可查看或修改
            that.selectedDayNotes = dayNotes;
            that.$refs["notepad-object"].style.visibility = "visible";
            if(window.Browser["Edge"] && !window.Browser["IE"]){ // 针对 Edge 翻转效果的问题作出改变
                that.flip = true;
                setTimeout(function(){
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
            };
            that.selectedDayNotesPage = 0; // 初始就显示的当日第一条便签
            that.ia_ele.focus()
            that.ia_ele.value = that.ia_val = dayNotes[0].title;
            that.title_show = dayNotes[0].title.length === 0;
            that.ta_ele.value = that.ta_val = dayNotes[0].content;
            that.buildTime = dayNotes[0].update_time;
            that.tip_id = dayNotes[0].id;
        },
        calen (data) {
            if(window.Browser["Edge"] && !window.Browser["IE"]){ // 针对 Edge 翻转效果的问题作出改变
                that.flip = false;
                setTimeout(function(){
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
            var have_val = that.ia_ele.value || that.ta_ele.value;
            var tmp = {
                "id": that.tip_id,
                "title": that.ia_ele.value,
                "content": that.ta_ele.value,
                "update_time": that.buildTime
            };
            have_val && utils.AjaxRequest.post({
                "url": "http://localhost:4321/sendNotes",
                "queryString": utils.joint(tmp),
                "onSuccess": function (req) {
                    that.set3pagesDates(that.prev_select_obj.json.objectDate);
                    that.adding_today_notes && that._toMonth_.toMonthDates[that.toDateDayNum-1].todayNotes.push(tmp);
                },
                "onError": function (req) {
                }
            })
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
            that._toMonth_.todayDate = new Date(yyyyMMdd).format("yyyy/MM/dd");
            that.dateJSON = {
                "year": parseInt(new Date(yyyyMMdd).format("yyyy")),
                "month": parseInt(new Date(yyyyMMdd).format("MM")),
                "day": num
            }
        },
        returnBottomLabel (sy, sm, sd, lm, ld) {
            let y = parseInt(sy), m = parseInt(sm), d = parseInt(sd);
            let sts = utils.getSolarTerm(sy, sm, sd);
            let bt_dis = "";
            that.queriedFestivalTable[y] && 
            that.queriedFestivalTable[y][m] && 
            that.queriedFestivalTable[y][m][d] ? 
                (bt_dis = that.queriedFestivalTable[y][m][d][0]) : 
                    (bt_dis = sts);
            // 默认展示农历日，如果节日名称长度超过或等于 5 字则换为农历日的展示
            (bt_dis.length >= 5 || bt_dis.length === 0) && (bt_dis = ld);
            return bt_dis;
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
            var h = parseFloat(window.getComputedStyle(that.$refs["calendar-object"], "").getPropertyValue("height"));
            that.notepadHeight = h;
            that.prevDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, -1), "prevDatesData");
            that.centerDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is));
            that.nextDatesData = that.makeDatesData(that.getTheMonth(center_yyyyMM_Is, 1), "nextDatesData");
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
                that.nextDatesData = that.makeDatesData(that._toMonth_.objectDate, "nextDatesData");
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
                that.prevDatesData = that.makeDatesData(that._toMonth_.objectDate, "prevDatesData");
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
        },
        titling (e) {
            var val = e.target.value;
            that.ia_val = val;
            that.title_show = val.length === 0;
        },
        writing (e) {
            var val = e.target.value;
            that.ta_val = val;
        },
        back () {
            that.selectedDayNotesPage --;
            if(that.selectedDayNotesPage === -1) that.selectedDayNotesPage = 0;
            let n = that.selectedDayNotesPage;
            that.ia_ele.value = that.ia_val = that.selectedDayNotes[n].title;
            that.title_show = that.selectedDayNotes[n].title.length === 0;
            that.ta_ele.value = that.ta_val = that.selectedDayNotes[n].content;
            that.buildTime = that.selectedDayNotes[n].update_time;
            that.tip_id = that.selectedDayNotes[n].id;
        },
        forward () {
            that.selectedDayNotesPage ++;
            if(that.selectedDayNotesPage === that.selectedDayNotes.length) that.selectedDayNotesPage = that.selectedDayNotes.length-1;
            let n = that.selectedDayNotesPage;
            that.ia_ele.value = that.ia_val = that.selectedDayNotes[n].title;
            that.title_show = that.selectedDayNotes[n].title.length === 0;
            that.ta_ele.value = that.ta_val = that.selectedDayNotes[n].content;
            that.buildTime = that.selectedDayNotes[n].update_time;
            that.tip_id = that.selectedDayNotes[n].id;
        },
        back_to_sy_sm () {
            that.$refs["viewall-notes"]["pageName"] = "sy_sm";
            that.$refs["viewall-notes"]["selected_notes_arr"].splice(0);
            that.selected_notes_arr_length = that.$refs["viewall-notes"]["selected_notes_arr"].length;
            that.back_to_sy_sm_btn_isShow = false;
            utils.AjaxRequest.post({
                "url": "http://localhost:4321/getDBInfo",
                "onSuccess": function (req) {
                    var viewall_arr = [];
                    var data = JSON.parse(req.responseText);
                    for(var year in data){
                        for(var month in data[year]){
                            let tmp = {
                                "sy": year,
                                "sm": month,
                                "c": data[year][month].notesNum
                            };
                            viewall_arr.unshift(tmp);
                        }
                    };
                    that["viewall_arr"] = viewall_arr;
                }
            });
        },
        delete_selected () {
            let tar_notes = that.$refs["viewall-notes"].selected_notes_arr;
            let will_del_notes_ids = tar_notes.map((item)=>{return item.n_id});
            window.dia.setData({
                "dia_isShow": true,
                "dia_title": "删除便笺",
                "dia_content": "<p>确定删除这" + tar_notes.length + "项便笺吗？</p>" + 
                    "<p class='will_del_list'>" + 
                    tar_notes.map((item)=>{
                        return item["n_id"];
                    }).join("<span>， </span>") +
                    "</p>",
                "dia_footer": [
                    {
                        "label": "确定",
                        fn () {
                            window.dia.setData("dia_isShow", false);
                            utils.AjaxRequest.post({
                                "url": "http://localhost:4321/deleteNotes",
                                "queryString": joint({
                                    "notes": JSON.stringify(will_del_notes_ids)
                                }),
                                "onSuccess": function (req) {
                                    for(var x=0, l=that.$refs["viewall-notes"].sd_arr.length; x<l; x++){
                                        for(var d=0, m=that.$refs["viewall-notes"].sd_arr[x].notes.length; d<m; d++){
                                            if(that.$refs["viewall-notes"].sd_arr[x].notes[d]){
                                                var p = will_del_notes_ids.indexOf(that.$refs["viewall-notes"].sd_arr[x].notes[d].n_id);
                                                if(p !== -1){
                                                    that.$refs["viewall-notes"].sd_arr[x].notes.splice(d, 1, {});
                                                }
                                            }
                                        }
                                    }
                                    tar_notes.splice(0);
                                    that.selected_notes_arr_length = tar_notes.length;
                                }
                            });
                            // that._toMonth_ notes 同步
                            will_del_notes_ids.forEach((a) => {
                                that._toMonth_.toMonthDates.forEach((b, c) => {
                                    b.todayNotes.forEach((note, i) => {
                                        if(note.id === a){
                                            that._toMonth_.toMonthDates[c].todayNotes[i] && that._toMonth_.toMonthDates[c].todayNotes.splice(i, 1)
                                        }
                                    });
                                });
                            });
                        }
                    },
                    {
                        "label": "取消",
                        fn () {
                            window.dia.setData("dia_isShow", false);
                            let sd_arr = that.$refs["viewall-notes"].sd_arr;
                            for(var m=0, a=sd_arr.length; m<a; m++){
                                for(var n=0, b=sd_arr[m]["notes"].length; n<b; n++) 
                                    will_del_notes_ids.indexOf(sd_arr[m]["notes"][n].n_id) !== -1 && 
                                        (sd_arr[m]["notes"][n].isSelected = false);
                            }
                            tar_notes.splice(0);
                            that.selected_notes_arr_length = tar_notes.length;
                        }
                    }
                ]
            });
        }
    },
    data () {
        return {
            APP: "hidden",
            queryList: [],
            "queryFes": {},
            "bottom_displayer": false,
            "navIsShow": false,
            "sel_show": false,
            "tip_isShow": true,
            "screen": "",
            "calen_header": "本年一览",
            "isi": {
                "item_tot": 4,
                "active_page": 1
            },
            "menuLeave": true,
            startWeekOn: "",
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
            title_show: true,
            tip_id: "#",
            ia_val: "",
            ta_val: "",
            selectedDayNotes: [],
            selectedDayNotesPage: 0,
            adding_today_notes: false,
            "viewall_arr": [],
            back_to_sy_sm_btn_isShow: false,
            selected_notes_arr_length: 0
        }
    },
    created () {
        that = this;
        var now_ = new Date();
        var now = now_.format("yyyy/MM")
        that.toDateDayNum = parseInt(now_.format("dd"));
        that.prevDatesData = that.makeDatesData(that.getTheMonth(now, -1), "prevDatesData");
        that.centerDatesData = that._toMonth_ = that.makeDatesData(that.getTheMonth(now));
        that.nextDatesData = that.makeDatesData(that.getTheMonth(now, 1), "nextDatesData");
        that.prev_select_obj ={
            "idx": parseInt(now_.format("dd")),
            "json": that._toMonth_
        }
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
        utils.AjaxRequest.post({
            "url": "http://localhost:4321/getSettings",
            "queryString": utils.joint({
                "name": "周首日"
            }),
            "onSuccess": function (req) {
                let data = JSON.parse(req.responseText);
                let opt = data.name === "周首日" && data.options.filter((item)=>{return item.checked})[0].label;
                opt && (that.startWeekOn = opt);
                var now_ = new Date();
                var now = now_.format("yyyy/MM")
                // 矫正日历显示
                that.prevDatesData = that.makeDatesData(that.getTheMonth(now, -1), "prevDatesData");
                that.centerDatesData = that.makeDatesData(that.getTheMonth(now));
                that.nextDatesData = that.makeDatesData(that.getTheMonth(now, 1), "nextDatesData");
                that.APP = "visible";
            }
        });
        utils.AjaxRequest.post({
            "url": "http://localhost:4321/getSettings",
            "queryString": utils.joint({
                "name": "节日或事件显示程度"
            }),
            "onSuccess": function (req) {
                let data = JSON.parse(req.responseText);
                let opt = data.options.map((item, index)=>{
                    return item.checked ? index.toString() : null;
                }).filter(item=>{
                    return item;
                })[0]; // 获取checked为true的选项的索引
                let q_list = ["important", "not-important", "normal"].slice(0, parseInt(opt)+1);
                that.queryList = q_list;
            }
        });
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
.nav > .icon-banner{
    position: relative;
    font-size: 1rem; letter-spacing: .0125rem;
}
.calen-header{
    position: absolute; left: 0; top: 0; 
    display: flex; justify-content: center; align-items: center;
    box-sizing: border-box; border-bottom: 1px solid rgba(0, 0, 0, .08);
    height: 100%; width: 100%;
}
.container{
    width: 100%; height: calc(100% - 48px);
    overflow: hidden;
}
.sel-mask{
    position: absolute; left: 0; top: 0;
    width: 100%; height: 100%; visibility: visible; z-index: 3;
}
.inner-slide-container{
    width: 100%; height: 100%; position: relative;
    background-color: #fff;
    font-size: 1rem;
}
.inner-slide-item{
    width: 100%; height: 100%; position: absolute; left: 0; top: 0;
    background-color: #fff;
    transform-origin: top center;
    overflow-y: auto;
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
.note_order_class{
    font-weight: 500; color: #ea5245;
}
p.will_del_list{
    color: #ea5245!important;
}
p.will_del_list span{
    color: #333;
}
</style>

