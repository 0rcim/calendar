// MD 字体图标
<template>
    <i class="md-ico" :codepoint="codepoint" :color="color" :style="icoStyle" v-html="html"></i>
</template>
<script>
var that = null;
import ico_refer from "../server/codepoint";
export default {
    "name": "MdIco",
    "props": ["codepoint", "color"],
    "computed": {
        html: function () {
            var ir = ico_refer.codepoints[that.codepoint];
            return ir ? `&#x${ir};` : "";
        },
        hide: function () {
            return !!that.html;
        },
        icoStyle: function () {
            return {
                "color": `${that.color}`
            }
        }
    },
    created () {
        that = this;
    }
}
</script>
<style>
.md-ico{font-size: 18px; cursor: pointer; -webkit-tap-highlight-color: transparent;}
</style>



