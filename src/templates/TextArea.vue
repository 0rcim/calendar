<template>
    <div class="text-area">
        <textarea :ref="ta" name="notepad" placeholder="Your Notes Here..." @scroll="ta_scroll($event)" @input="writing($event)"></textarea>
        <div class="bottomTip" :class="{'active': active}"><span v-text="tip_id"></span></div>
    </div>
</template>
<script>
export default {
    "name": "textArea",
    "props": ["ta", "tip_id"],
    "methods": {
        ta_scroll (e) {
            var eleHeight = parseFloat(window.getComputedStyle(e.target, "").getPropertyValue("height"));
            var isReachedBottom =
            window.Browser["IE"] ? (
                Math.ceil(
                    parseFloat(window.getComputedStyle(this.$refs["ta"], "").getPropertyValue("padding-bottom")) + 
                    e.target.scrollTop + eleHeight
                ) === e.target.scrollHeight
            ) : (e.target.scrollTop + eleHeight >= e.target.scrollHeight);
            this.active = e.target.scrollTop === 0 || isReachedBottom; // 滚动至底或至顶显示右下角timestamp——id 兼容 IE
        },
        writing (e) {
            this.$emit("writing", e)
        }
    },
    data () {
        return {
            "active": true
        }
    }
}
</script>
<style>
.text-area{
    position: relative;
    display: flex;
    font-size: 1rem;
    height: calc(100% - 113px);
    justify-content: center; flex-wrap: nowrap;
}
.text-area textarea{
    display: block; height: 100%; width: 100%; max-width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    font-family: inherit;
    background-color: #fff;
    outline-color: transparent;
    padding: 0 1rem 2rem;
    resize: none;
    border: 0;
    caret-color: #ea5245;
    /* overflow: hidden; */
}
.text-area textarea::-webkit-scrollbar-track {
  background: #fff;
}
.text-area .bottomTip{
    position: absolute;
    right: 0; bottom: .25rem; 
    font-size: 14px; font-weight: 200; color: #f5f5f5;
    letter-spacing: .08rem;
    padding: .125rem;
    margin-right: 1.25rem;
    background-color: #ea5245;
    border-radius: 2.5px;
    transform: translateY(2rem);
    transition: transform 250ms 100ms;
}
.text-area .bottomTip.active{
    transform: translateY(0);
}
</style>

