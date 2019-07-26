<template>
    <div class="input-area">
        <div class="place-holder" v-show="title_show"><span>标题</span></div>
        <input :ref="ia" type="text" @input="titling($event)">
    </div>
</template>
<script>
export default {
    "name": "inputArea",
    "props": ["title_show", "ia"],
    "methods": {
        titling (e) {
            // var val = e.target.value;
            // this.title_show = val.length === 0;
            this.$emit("titling", e)
            // console.log(e.target.value)
        }
    }
}
</script>
<style>
.input-area{
    position: relative;
    font-size: 16px;
    padding: 0 1rem;
    /* background-color: green; */
}
.input-area .place-holder{
    position: absolute; left: 0; top: 0;
    display: flex; align-items: center;
    padding: 0 1rem;
    width: calc(100% - 2rem); height: 100%;
    font-size: 1.25rem; letter-spacing: .1rem;
    font-weight: 500; 
    color: #ccc;
    pointer-events: none;
}
.input-area input{
    display: block;
    width: 100%;
    padding: 5px 0;
    font-size: 22px; font-weight: bold;
    box-sizing: border-box; outline-color: transparent;
    border: 0;
    flood-color: #fdf1f0;
    caret-color: #ea5245;
}
.input-area input::-ms-clear, .input-area input::-ms-reveal{display: none}
::selection {   
    background: #fdf1f0;
}
::-moz-selection {   
    background: #fdf1f0;
}
::-webkit-selection {   
    background: #fdf1f0;
}
</style>


