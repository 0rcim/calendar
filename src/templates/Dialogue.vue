<template>
<transition name="fade">
    <div class="dia_bg" :class="{'show_dia': dia_isShow}" v-show="dia_isShow">
        <transition name="offset">
            <div class="dia-box placeList" v-show="dia_isShow">
                <div class="dia-title"><h6 class="md-text-setting" v-text="dia_title">对话框标题</h6></div>
                <div class="dia-content" v-if="dia_content" v-html="dia_content">
                </div>
                <div class="options" v-if="options || options.length">
                    <div class="option-item" :class="{'active': item.checked}" v-for="(item, index) in options" :key="index" @click="option_selected(index)">
                        <div class="label">
                            <span v-text="item.label"></span>
                        </div>
                        <div class="indi">
                            <md-ico v-show="item.checked" :codepoint="'check'" :color="'#ea2325'"></md-ico>
                        </div>
                    </div>
                </div>
                <div class="dia-footer">
                    <button v-for="(item, index) in dia_footer" :key="index" @click="item.fn">
                        <span v-text="item.label"></span>
                    </button>
                </div>
            </div>
        </transition>
    </div>
</transition>
</template>
<script>
var that = null;
import mdIco from "./MdIco.vue";
export default {
    "name": "dialogue",
    "components": { mdIco },
    "methods": {
        setData (...obj) {
            obj.length === 1 ? (()=>{for(var key in obj[0])that[key] = obj[0][key]})() : (that[obj[0]] = obj[1]);
        }
    },
    data () {
        return {
            dia_isShow: false,
            dia_title: "对话框标题",
            dia_content: "对话框内容。。。。",
            options: [
                {
                    "label": "label1",
                    "checked": false
                },
                {
                    "label": "label1",
                    "checked": false
                }
            ],
            option_selected: function () {},
            dia_footer: []
        }
    },
    created () {
        that = this;
        window.dia = {};
        window.dia.setData = that.setData;
    }
}
</script>

<style>
/* .dia-box.placeList{width: calc(100% - 96px); transform: translateY(25px); opacity: 0; visibility: hidden;} */
.dia_bg{visibility: hidden;opacity: 0;}
.dia_bg.show_dia{visibility: visible; opacity: 1;}
.dia_bg.show_dia .dia-box{visibility: visible; opacity: 1; transform: translateY(0); transition-delay: 200ms;}
.dia_bg{width: 100%; height: 100%; background-color: rgba(0, 0, 0, .5); position: absolute; left: 0; bottom: 0; z-index: 5; display: flex; justify-content: center; align-items: center;}
.dia-box{max-width: 400px; width: 75%; max-height: calc(100% - 96px); display: flex; flex: 0 1 auto; margin: 48px; position: relative; overflow-y: auto; flex-direction: column; box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12); border-radius: 4px; background-color: #fff;}
.dia-title{flex: 0 0 auto; margin: 0; padding: 24px 24px 20px;}
.dia-title h6{font-size: 1.25rem; color: rgba(0, 0, 0, .87); font-weight: 600; line-height: 1.6; letter-spacing: 0.0075em; margin: 0; display: block}
.dia-content{display: block; flex: 1 1 auto; padding: 0 24px 24px; overflow-y: auto;}
.dia-content p{line-height: 1.5; color: #666; font-size: 1rem; font-weight: 400; letter-spacing: .00938em; margin: 0;}
.dia-footer{flex: 0 0 auto; margin: 8px 4px; display: flex; align-items: center; justify-content: flex-end; }
.dia-footer button{margin: 0 4px; color: #f44336; padding: 6px 8px; font-size: .875rem; min-width: 64px; box-sizing: border-box; transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; line-height: 1.75; font-weight: 500; border-radius: 4px; letter-spacing: .02857em; cursor: pointer; display: inline-flex; -webkit-appearance: none; -moz-appearance: none; position: relative; outline: none; align-items: center; user-select: none; vertical-align: middle; justify-content: center; font-size: .875rem; border: 0; background-color: rgba(0, 0, 0, 0); -webkit-tap-highlight-color: transparent;}
.dia-footer button:hover, .dia-footer button:focus{text-decoration: none; background-color: rgba(244, 67, 54, .08);}
/* options */
.option-item{
    display: flex;
    min-height: 3.5rem; padding: 0 24px;
    font-size: 1rem;
    transition: backgroud-color 150ms ease-in-out;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
}
.option-item:hover{
    background-color: rgba(0, 0, 0, .02);
}
.option-item .label{
    display: flex; align-items: center;
    font-weight: 500;
    width: calc(100% - 40px);
}
.option-item .indi{
    display: flex; align-items: center; justify-content: flex-end;
    width: 40px;
}
.option-item:not(:last-child) .label, .option-item:not(:last-child) .indi{
    border-bottom: 1px solid rgba(0, 0, 0, .04); box-sizing: border-box;
}
.option-item.active .label span{
    color: #ea2325;
}
</style>

