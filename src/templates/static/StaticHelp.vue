<template>
    <div class="help">
        <div class="logo">
            <img src="src/img/calendar-icon.svg" alt="app-logo">
            <b>日历便笺</b>
        </div>
        <p style="color: #999;">欢迎使用日历便笺！请从下面的蓝色链接中选择以查看所需帮助。</p>
        <div class="links">
            <div class="href" :class="{'active': Q_A_show_control_bools[index]}" v-for="(item, index) in Q_A" :key="index" @click="active(index)">
                <a href="javascript:void(0);" v-html="item.h"></a>
            </div>
        </div>
        <div class="ans">
            <div v-for="(item, index) in Q_A" :key="index" v-show="Q_A_show_control_bools[index]">
                <h3 v-html="item.h"></h3>
                <p v-for="(para, idx) in item.p" :key="idx" v-html="para"></p>
            </div>
        </div>
    </div>
</template>
<script>
var that = null;
export default {
    "name": "staticHelp",
    "computed": {
        Q_A_show_control_bools () {
            var empty = [];
            for(var x=0; x<that.Q_A.length-1; empty[x++]=false);
            empty.splice(that.active_page, 0, true);
            return empty;
        }
    },
    "methods": {
        active (idx) {
            that.active_page = idx;
        }
    },
    data () {
        return {
            "Q_A": [
                {
                    "h": "如何查看历史便笺",
                    "p": [
                        "第一步先在「日历」面板界面上单击选择要查看的日期方格，第二步双击此方格即可转到浏览模式下的编辑便笺界面，点击左上角处“向左”“向右”箭头即可查看当日上一枚、下一枚便笺"
                    ]
                },
                {
                    "h": "如何添加便笺",
                    "p": [
                        "在「日历」面板右上，点击添加按钮，即可添加便笺，仅支持添加当日便笺"
                    ]
                },
                {
                    "h": "修改便笺",
                    "p": [
                        "第一步，「日历」面板界面，双击下方带有“短横线”的小方格，会转到编辑界面；",
                        "第二步，点击「编辑」界面左上角的按钮，确定要编辑的某条便笺，然后在输入框进行编辑；",
                        "第三步，编辑完成，点击界面右上角绿色按钮，表示编辑完成，之后数据会写入到本地文件",
                        "<b style='color:#ea5245;'>*</b> 由于界面设计原因，推荐在宽屏下进行编辑操作"
                    ]
                },
                {
                    "h": "删除便笺",
                    "p": [
                        "「日历」面板界面，右上角点击“目录”-左上角点击菜单选择-“查看所有便笺”-选择要删除的历史便笺-点击删除按钮图标"
                    ]
                },
                {
                    "h": "便笺数据导出",
                    "p": [
                        "便笺数据存储文件路径： ~/server/db/datesData.json"
                    ]
                },
                {
                    "h": "其他信息",
                    "p": [
                        "<b>VueJS:</b><span class='href' style='display: inline'><a href='https://vuejs.org/v2/guide/'>2.6.10</a></span>",
                        "<b>Webpack:</b><span class='href' style='display: inline'><a href='https://webpack.js.org/'>4.36.1</a><b> 2019/07</b></span>",
                        "<b>GitHub: </b><span class='href' style='display: inline'><a href='https://github.com/0rcim/calendar/'>https://github.com/0rcim/calendar</a></span>",
                        "<b>dev.</b><span class='href' style='display: inline'><a href='https://github.com/0rcim/'>@0rcim</a></span>"
                    ]
                }
            ],
            "Q_A_page": 0,
            "active_page": 0
        }
    },
    created () {
        that = this;
    }
}
</script>
<style>
.logo{display: flex; align-items: center; padding-top: 1.5rem; flex-direction: column;}
.logo img{display: block; width: 45px;}
.help{
    padding: .25rem 1rem; 
    background-color: #fff;
    line-height: 1.65rem;
}
.help .links{
    display: flex; flex-wrap: wrap;
}
.help .href{
    display: flex; justify-content: center; align-items: center;
    padding: .125rem; border-radius: .125rem;
    margin: 0 .45rem;
}
.help .href a{
    text-decoration: none; color: #4082fc;
}
.help .href:hover{
    background-color: rgba(64, 130, 252, .02)
}
.help .href.active{
    background-color: rgba(64, 130, 252, .08)
}
.help p{
    text-indent: 1rem;
}
.ans{
    word-break: break-all;
}
</style>
