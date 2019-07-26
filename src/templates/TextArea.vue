<template>
    <div class="text-area">
        <textarea name="notepad" placeholder="Your Notes Here..." @scroll="ta_scroll($event)"></textarea>
        <div class="bottomTip" :class="{'active': active}"><span>[2019-07-26]#01</span></div>
    </div>
</template>
<script>
export default {
    "name": "textArea",
    "methods": {
        ta_scroll (e) {
            var eleHeight = parseFloat(window.getComputedStyle(e.target, "").getPropertyValue("height"));
            var isReachedBottom = e.target.scrollTop + eleHeight >= e.target.scrollHeight;
            this.active = e.target.scrollTop === 0 || isReachedBottom;
        }
    },
    data () {
        return {
            "active": false
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

