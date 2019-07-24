<template>
    <div class="date-banner">
        <month-front-space v-for="v in datesData.toMonthFrontSpace" :key="v"></month-front-space>
        <date-grid v-for="(item, index) in datesData.toMonthDates" :key="index + '-dg'"
            :l_txt="item.lunarDate" 
            :s_txt="item.solarDate" 
            :isToday="item.isToday" 
            :isSelected="item.isSelected"
            :hasNotes="item.todayNotes.length != 0"
            @selected="selected" 
        ></date-grid>
    </div>
</template>
<script>
// :l_txt="item.lunarDate === '初一' ? item.lunarMonth + '月' : item.lunarDate" 
var that = null;
import monthFrontSpace from "./MonthFrontSpace.vue";
import dateGrid from "./DateGrid.vue";
export default {
    "name": "datesTable",
    "components": { monthFrontSpace , dateGrid },
    "props": ["datesData"],
    data () {
        return {
        }
    },
    "methods": {
        selected (data) {
            that.$emit("selected", {
                "json": this.datesData,
                "idx": data
            })
        }
    },
    created () {
        that = this;
    }
}
</script>
<style>
.date-banner{
    display: flex;
    flex-wrap: wrap;
    width: 100%; 
    padding: 1.5rem 0;
}
</style>


