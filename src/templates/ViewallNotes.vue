<template>
    <div class="viewall-notes">
        <div class="viewall-outer" :class="{[pageName]: true}">
            <div class="viewall-item" style="background-color: #fff">
                <div class="item-inner">
                    <div class="sy_sm-grid" v-for="(item, index) in sy_sm_arr" :key="index" :class="{[year_color_reflection[item.sy]]: true, 'active': active_bool[index]}" @click="goto_sd(item, index)">
                        <div class="dis_sy"><span v-text="item.sy"></span></div>
                        <div class="dis_count"><span v-text="item.c"></span></div>
                        <div class="dis_sm"><span v-text="item.sm"></span></div>
                    </div>
                </div>
            </div>
            <div class="viewall-item" style="background-color: #fff">
                <div class="nothing"><span>（空）</span></div>
                <div class="item-inner" style="background-color: #fff; min-height: 50%;">
                    <!-- sd_arr.notes 如果都为 {} （空对象） 则隐藏 -->
                    <div class="monthAllData" v-for="(item, index) in sd_arr" :key="index" v-show="!item['notes'].every(n=>{return Object.keys(n).length===0})">
                        <div class="day-header"><span v-text="item['d_header']"></span></div>
                        <div class="day-body">
                            <div class="notes-item" v-for="(obj, idx) in item['notes']" :class="{'selected': obj.isSelected}" :key="idx" @click="select_this(item, idx)" v-show="obj.n_id">
                                <h4 v-text="obj['h']"></h4>
                                <p v-text="obj['p']"></p>
                                <div class="notes-time">
                                    <div class="icon">
                                        <md-ico :codepoint="'access_time'"></md-ico>
                                    </div>
                                    <div class="stamp">
                                        <span v-text="obj['t']"></span>
                                        <span v-text="obj['#']"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import mdIco from "./MdIco.vue";
import utils from "../utils";
utils.dateFormat();
var that = null;
export default {
    "name": "viewallNotes",
    "props": ["sy_sm_arr"],
    "components": { mdIco },
    "computed": {
        year_color_reflection () {
            var empty = {};
            let emp = [];
            // 顺序建立
            for(var m=0, l=that.sy_sm_arr.length; m<l; m++) emp.indexOf(that.sy_sm_arr[m].sy) === -1 && emp.push(that.sy_sm_arr[m].sy);
            let n = 0;
            var reflect = emp.map((v) => {
                empty[v] = that.colors_year_pool[n++%that.colors_year_pool.length]; // 建立年份背景色查询表
            });
            return empty;
        },
        active_bool () {
            var bool = [];
            for(var m=0, l=that.sy_sm_arr.length; m<l; bool[m++]=false);
            if(that.active_grid<0) return bool; // 都未激活
            bool[that.active_grid] = true;
            return bool;
        }
    },
    "methods": {
        goto_sd (obj, idx) {
            that.active_grid = idx;
            that.pageName = "sd";
            that.$parent.back_to_sy_sm_btn_isShow = true;
            utils.AjaxRequest.post({
                "url": "http://localhost:4321/getNotes",
                "queryString": utils.joint({
                    "sy": obj.sy,
                    "sm": obj.sm
                }),
                "onSuccess": function (req) {
                    var data = JSON.parse(req.responseText);
                    let arr = [];
                    for(var day in data){
                        if(!data[day].length) continue;
                        let tmp = {
                            "d_header": new Date(`${obj.sy}/${obj.sm}/${day}`).format("yyyy年M月d日"),
                            "notes": []
                        };
                        for(var x=0, l=data[day].length; x<l; x++){
                            let o = {
                                "h": data[day][x].title,
                                "p": data[day][x].content,
                                "t": data[day][x].update_time,
                                "isSelected": false,
                                "#": data[day][x].id.replace(/(.*)#(.*)/, "$2"),
                                "n_id": data[day][x].id
                            };
                            tmp["notes"].push(o);
                        };
                        arr.push(tmp);
                    }
                    that.sd_arr = arr;
                }
            });
        },
        select_this (o, i) {
            o.notes[i].isSelected = !o.notes[i].isSelected;
            o.notes[i].isSelected ? that.selected_notes_arr.push(o.notes[i]) : 
                that.selected_notes_arr.splice(that.selected_notes_arr.indexOf(o.notes[i]), 1);
            that.$parent.selected_notes_arr_length = that.selected_notes_arr.length;
        }
    },
    data () {
        return {
            "colors_year_pool": [
                "grey0", "grey8", "grey16"
            ],
            "pageName": "sy_sm",
            active_grid: -1,
            sd_arr: [],
            selected_notes_arr: []
        }
    },
    created () {
        that = this;
    },
    mounted () {
        that.$parent.back_to_sy_sm()
    }
}
</script>
<style>
.sy_sm-grid.grey16{background-color: rgba(0, 0, 0, .16);}
.sy_sm-grid.grey8{background-color: rgba(0, 0, 0, .08);}
.sy_sm-grid.grey0{background-color: rgba(0, 0, 0, 0);}
.viewall-notes{
    width: 100%; height: 100%; background-color: green; overflow: hidden;
}
.viewall-outer{
    display: flex; flex-wrap: nowrap; align-items: center;
    width: 200%; height: 100%; 
    transition: transform 300ms 100ms ease-in-out;
}
.viewall-outer.sy_sm{
    transform: translateX(0)
}
.viewall-outer.sd{
    transform: translateX(-50%)
}
.viewall-item{
    position: relative;
    width: 50%; height: 100%; overflow-y: auto;
}
.sy_sm-grid{
    display: flex; flex-direction: column; 
    box-sizing: border-box;
    width: calc(100% / 4); height: 110px; background-color: transparent;
    transition: background-color 350ms;
}
.viewall-item .sy_sm-grid{
    border: 1px solid rgba(0, 0, 0, .08); border-top-color: transparent; border-left-color: transparent;
}
.viewall-item .sy_sm-grid:nth-child(4n){
    border-right-color: transparent;
}
.item-inner{
    display: flex; flex-wrap: wrap; width: 100%; height: auto; padding-bottom: .5rem; position: relative; z-index: 2;
}
.sy_sm-grid:hover{
    border-color: rgba(234, 82, 69, .25)!important; cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.sy_sm-grid:active{
    background-color: rgba(234, 82, 69, .16);
}
.sy_sm-grid.active{
    border-color: #ea5245!important; background-color: rgba(234, 82, 69, .16);
}
.sy_sm-grid .dis_sy{
    display: flex; justify-content: center; align-items: center;
    height: 35px; 
    font-weight: 500; letter-spacing: .0125rem; color: #333;
    opacity: .78;
}
.sy_sm-grid .dis_count{
    display: flex; justify-content: center; align-items: center;
    height: 15px;
    font-size: 15px; font-weight: 500; color: #222;
    opacity: .68;
}
.sy_sm-grid .dis_count::after{
    content: "枚";
    font-size: .5rem; font-weight: 500; color: #ea5245;
    padding-left: .125rem;
}
.sy_sm-grid .dis_sm{
    display: flex; justify-content: center; align-items: center;
    height: 55px;
    font-size: 25px; color: #111;
}
.sy_sm-grid .dis_sm span:after{
    content: "月";
    padding-left: .125rem;
    font-size: 12px; color: #333;
}
.monthAllData{
    width: 100%;
}
.day-header{
    display: flex; align-items: center;
    width: 100%; height: 2rem;
    background-color: #f5f5f5;
}
.day-body{
    padding: .25rem .75rem;
}
.day-header span{
    padding-left: 1.5rem;
    font-size: 14px; font-weight: 400; color: #666;
    letter-spacing: .0525rem;
}
.notes-item{
    padding: .65rem .5rem;
    margin: .35rem 0;
    background: #fff;
    border: .5px solid rgba(0, 0, 0, .08);
    border-radius: .15rem;
}
.notes-item.selected{
    border-color: #ea5245;
}
.notes-item h4{
    margin: 0; padding: .25rem 0 0 0;
    text-overflow: ellipsis; overflow: hidden; width: 100%;
}
.notes-item p{
    margin: 0; padding: .25rem 0 0 0;
    word-break: break-all;
    color: #4c4c4c; line-height: 1.45rem;
}
.notes-time{
    width: 100%; height: 1.5rem; display: flex; align-items: center;
    margin-top: .25rem; color: #a6a6a6;
}
.notes-time .icon{
    display: flex;
    font-size: 0; height: 100%; align-items: center;
}
.notes-time .icon .md-ico{
    font-size: 16px;
}
.notes-time .stamp{
    display: flex; align-items: center;
    height: 100%; padding-left: .25rem;
    font-size: 14px; line-height: 14px;
}
.notes-time .stamp > span:last-child{
    color: #ea5245; font-weight: 500;
}
.notes-time .stamp > span:last-child::before{
    content: "#"
}
@media only screen and (min-width: 512px) {
    .sy_sm-grid .dis_sm{
        font-size: 45px;
    }
    .sy_sm-grid .dis_sm span:after{
        font-size: 20px;
    }
}
.nothing{
    display: flex; justify-content: center; align-items: center;
    position: absolute; top: 0; left: 0; width: 100%; z-index: 1;
    width: 100%; height: 100%; 
}
.nothing span{
    margin-top: -2.5rem; color: #666;
}
</style>
