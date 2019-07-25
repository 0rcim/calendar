// MD 字体图标
<template>
    <i class="md-ico" :codepoint="codepoint" :style="{'color': color}" v-html="`&\#x${codepoints[codepoint]};`"></i>
</template>
<script>
import { codepoints } from "../server/data/codepoints";
export default {
    "name": "MdIco",
    "props": ["codepoint", "color"],
    data () {
        return {
            "codepoints": codepoints
        }
    }
}
</script>
<style>
.md-ico{font-size: 18px; cursor: pointer; -webkit-tap-highlight-color: transparent;}
</style>



