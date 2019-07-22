import Vue from "vue";
import App from "./templates/calendar-main.vue";
import "./style/main.css";
var app = new Vue({
    "el": "#app",
    "template": "<App/>",
    "components": { App },
    created () {
        window.onresize = function () {
            // console.log("resize")
        }
    }
});