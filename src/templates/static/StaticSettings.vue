<template>
    <div class="static-settings">
        <div class="type-selector" @click="StartWeekOn">
            <div class="selector">
                <div class="selector-container">
                    <div class="label">
                        <div class="label-main">周首日</div>
                        <div class="label-sub" v-text="StartWeekOn_sub"></div>
                    </div>
                    <div class="indi">
                        <md-ico :codepoint="'arrow_drop_down'"></md-ico>
                    </div>
                </div>
            </div>
        </div>
        <div class="type-selector" @click="EventsDisplay">
            <div class="selector">
                <div class="selector-container">
                    <div class="label">
                        <div class="label-main">节日或事件显示程度</div>
                        <div class="label-sub" v-text="EventsDisplay_sub"></div>
                    </div>
                    <div class="indi">
                        <md-ico :codepoint="'arrow_drop_down'"></md-ico>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import mdIco from "../MdIco.vue";
import { AjaxRequest , joint } from "../../utils";
var that = null;
export default {
    "name": "staticSettings",
    "components": { mdIco },
    "computed": {
        StartWeekOn_sub () {
            for(var a=0, l=that.startWeekOn_options.length; a<l; a++){
                if(that.startWeekOn_options[a].checked){
                    return that.startWeekOn_options[a].label
                }
            }
        },
        EventsDisplay_sub () {
            for(var a=0, l=that.EventsDisplay_options.length; a<l; a++){
                if(that.EventsDisplay_options[a].checked){
                    return that.EventsDisplay_options[a].label
                }
            }
        }
    },
    "methods": {
        StartWeekOn () {
            window.dia.setData({
                "dia_isShow": true,
                "dia_title": "周首日",
                "dia_content": "",
                "options": that.startWeekOn_options,
                option_selected (idx) {
                    console.log("#53", idx);
                    window.dia.setData("dia_isShow", false);
                    for(var a=0, l=that.startWeekOn_options.length; a<l; a++){
                        that.startWeekOn_options[a].checked = false;
                    }
                    that.startWeekOn_options[idx].checked = true;
                    AjaxRequest.post({
                        "url": "http://localhost:4321/sendSettings",
                        "queryString": joint({
                            "setting": JSON.stringify({
                                "name": "周首日",
                                "options": that.startWeekOn_options
                            })
                        }),
                        "onSuccess": function () {
                            that.$parent.startWeekOn = that.startWeekOn_options[idx].label;
                            that.$parent.$refs["yearday-list"].week_ref = that.$parent.week_order;
                            that.$parent.set3pagesDates(that.$parent.centerDatesData.objectDate);
                        }
                    });
                },
                "dia_footer": []
            })
        },
        EventsDisplay () {
            window.dia.setData({
                "dia_isShow": true,
                "dia_title": "节日或事件显示程度",
                "dia_content": "",
                "options": that.EventsDisplay_options,
                option_selected (idx) {
                    console.log("#53", idx);
                    window.dia.setData("dia_isShow", false);
                    for(var a=0, l=that.EventsDisplay_options.length; a<l; a++){
                        that.EventsDisplay_options[a].checked = false;
                    }
                    that.EventsDisplay_options[idx].checked = true;
                    AjaxRequest.post({
                        "url": "http://localhost:4321/sendSettings",
                        "queryString": joint({
                            "setting": JSON.stringify({
                                "name": "节日或事件显示程度",
                                "options": that.EventsDisplay_options
                            })
                        }),
                        "onSuccess": function (req) {
                            console.log(JSON.parse(req.queryString.split("=")[1]))
                            // let data = JSON.parse(req.responseText);
                            let opt = JSON.parse(req.queryString.split("=")[1]).options.map((item, index)=>{
                                return item.checked ? index.toString() : null;
                            }).filter(item=>{
                                return item;
                            })[0]; // 获取checked为true的选项的索引
                            let q_list = ["important", "not-important", "normal"].slice(0, parseInt(opt)+1);
                            that.$parent.queryList = q_list;
                        }
                    });
                },
                "dia_footer": []
            })
        }
    },
    data () {
        return {
            refers: {
                "周首日": "startWeekOn_options",
                "节日或事件显示程度": "EventsDisplay_options"
            },
            startWeekOn_options: [
                {
                    "label": "周一",
                    "checked": true
                },
                {
                    "label": "周日",
                    "checked": false
                }
            ],
            EventsDisplay_options: [
                {
                    "label": "一般",
                    "checked": false
                },
                {
                    "label": "普通",
                    "checked": false
                },
                {
                    "label": "全部",
                    "checked": true
                }
            ]
        }
    },
    created () {
        that = this;
    },
    mounted () {
        AjaxRequest.post({
            "url": "http://localhost:4321/getSettings",
            "queryString": "name=*",
            "onSuccess": function (req) {
                var data = JSON.parse(req.responseText);
                for(var x=0, l=data.length; x<l; x++){
                    that[that.refers[data[x].name]] = data[x].options;
                };
            }
        });
    }
}
</script>
<style>
.static-settings{
    font-size: 1rem;
}
.static-settings > div:first-child{
    padding-top: .25rem;
}
.type-selector{
    height: 4.5rem;
    background-color: #f5f5f5;
}
.type-selector .selector{
    height: 100%; padding: 0 .945rem; 
    background-color: #fff;
    transition: background-color 100ms ease-in-out;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.type-selector .selector:hover{
    background-color: #f5f5f5;
}
.type-selector .selector .selector-container{
    display: flex; 
    height: 100%; box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, .08)
}
.selector-container .label{
    display: flex; justify-content: center; flex-direction: column;
    width: calc(100% - 2rem);
}
.selector-container .label .label-main{
    font-size: 1rem; font-weight: 500;
    padding-bottom: .125rem;
}
.selector-container .label .label-sub{
    font-size: .75rem; color: #666;
}
.selector-container .indi{
    display: flex; justify-content: flex-end; align-items: center;
    width: 2rem;
}
.selector-container .indi .md-ico{
    color: #ea2325;
}
</style>