// 图标按钮涟漪效果
<template>
    <div class="ico-outer" :style="trStyle" :side="side" @click="event_click()" :title="comment">
        <div class="touch-ripple">
            <slot></slot>
        </div>
    </div>
</template>
<script>
var that = null;
var config = {
    "side": ["left", "right"]
};
export default {
    "name": "touchRipple",
    "props": ["side"],
    "methods": {
        event_click () {
            this.$emit("event_click")
        }
    },
    "computed": {
        trStyle: function () {
            return {
                "float": config["side"][that.side]
            }
        },
        comment: function () {
            return that.title;
        }
    },
    created () {
        that = this;
    }
}
</script>
<style>
.ico-outer{height: 100%; display: flex; align-items: center; padding: 0 .2rem; cursor: pointer; -webkit-tap-highlight-color: transparent;}
.touch-ripple{display: flex; justify-content: center; align-items: center; position: relative; width: 32px; height: 32px;}
.ico-outer:active .touch-ripple::before{background-color: rgba(234, 82, 69, .08);}
.touch-ripple:hover::before{opacity: 1;}
.touch-ripple::before{content: ""; display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 50%; background-color: rgba(0, 0, 0, .08); opacity: 0; transition: opacity 400ms ease; transform: scale(2.1); transform-origin: center;}
</style>
