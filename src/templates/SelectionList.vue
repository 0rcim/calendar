<template>
    <ul class="selection-list">
        <li class="item" v-for="(list_item, index) in list_map" :key="index" @click="list_item.fn"><span v-text="list_item.label">查看所有便笺</span></li>
    </ul>
</template>
<script>
var that = null;
export default {
    "name": "selectionList",
    "methods": {
        active (num) {
            that.$parent.isi.active_page = num;
            that.$parent.sel_show = false;
            that.$parent.calen_header = that.list_map[num].label;
        }
    },
    created () {
        that = this;
    },
    data () {
        return {
            "list_map": [
                {
                    "label": "查看所有便笺",
                    "fn": function () {
                        that.active(0);
                    }
                },
                {
                    "label": "事件列表",
                    "fn": function () {
                        that.active(1);
                    }
                },
                {
                    "label": "设置",
                    "fn": function () {
                        that.active(2);
                    }
                },
                {
                    "label": "帮助",
                    "fn": function () {
                        that.active(3);
                    }
                }
            ]
        }
    }
}
</script>
<style>
.selection-list{
    position: absolute; left: .5rem; top: calc(48px + .25rem); z-index: 3;
    list-style: none;
    min-width: 8.5rem;
    padding: 0; margin: 0; padding: .25rem 0;
    font-size: 1rem; letter-spacing: .0125rem;
    transform-origin: left top;
    background-color: #fff;
    border-radius: .125rem;
    box-shadow: 0 5px 18px 0 rgba(14, 30, 37, .32);
}
.selection-list .item{
    display: flex; align-items: center;
    padding: 0 .5rem;
    white-space: nowrap;
    height: 40px;
    box-sizing: border-box;
    border: .5px solid rgba(0, 0, 0, .08); border-left: 0; border-right: 0;
    cursor: pointer; -webkit-tap-highlight-color: transparent;
    user-select: none;
}
.selection-list .item:last-child, .selection-list .item:first-child{
    border: 0
}
.selection-list .item:active{
    background-color: rgba(14, 30, 37, .16);
}
</style>

