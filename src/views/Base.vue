<template>
    <div class="base-div">
        <div class = "tool-btn">
            <div :class = "{'switch-tool': true, 'highlight': baseLayerIndex === 0}" 
                @click = "switchLayer({baseLayerIndex: 0, msg: '矢量'})">
                <img src = "../assets/vec_c.png" alt = "" width = "100%">
            </div>
            <div :class = "{'switch-tool': true, 'highlight': baseLayerIndex === 1}"
                @click = "switchLayer({baseLayerIndex: 1, msg: '影像'})">
                <img src = "../assets/img-c.png" alt = "" width = "100%">
            </div>
        </div>

        <div ref="map" id="map" class="map"></div>
        <Footer />
    </div>
</template>

<script src="../util/base.js">
</script>

<style lang = "less">
    .base-div {
        height: 100vh;
        background: #cccccc;
        position: relative;
    }

    .map {
        width: 100vw;
        height: 100%;
    }

    .tool-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 2;
        display: flex;
        width: 250px;
        justify-content: space-between;
        cursor: pointer;

        .switch-tool {
            width: 100px;
            height: 100px;
            border: 4px solid #fff;
            border-radius: 4px;
        }

        .highlight {
            border-color: #09f;
        }
    }

</style>
