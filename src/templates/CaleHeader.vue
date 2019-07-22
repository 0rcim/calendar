<template>
    <div class="cale-header">
        <div class="date"><span>{{ month }}月{{ day }}日</span></div>
        <div class="sub-date">
            <div class="year">{{ year }}</div>
            <div class="isToday">{{ isToday }}</div>
        </div>
    </div>
</template>
<script>
export default {
    "name": "CaleDate",
    "props": ["month", "day", "year", "isToday"],
}
</script>
<style>
.cale-header{
    width: 100%;
    /* background-color: green; */
    font-size: 1rem;
}
.cale-header .date span{
    display: flex; align-items: center;
    font-size: 26px; 
    letter-spacing: .025rem;
}
.sub-date{
    display: flex; align-items: flex-start;
    padding-top: .15rem;
    font-size: 14px;
    letter-spacing: .02rem;
    color: #999;
}
.sub-date .year{
    padding-right: .5rem;
}
</style>

