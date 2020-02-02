<template>
  <div class="web-scene">
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

    <div ref="map" id="map" class="map">
      <div id="titleDiv">Loading...</div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { loadCss, loadModules } from 'esri-loader';
import Footer from '../components/Footer';
import Vue from 'vue';

// https://developers.arcgis.com/javascript/latest/api-reference/esri-WebScene.html

export default {
  name: 'WebScene',
  components: {
    Footer
  },
  data() {
    return {
      webScene: Object, // arcgis webScene instance
      sceneView: Object, // arcgis SceneView instance
      baseLayerIndex: 0, // 用于指定当前底图
      gisConstructor: {}, //gis 构造函数
      gisModules: [
        "esri/views/SceneView",
        "esri/WebScene",
        // 'esri/Map',
        // 'esri/views/MapView',
        'esri/layers/WebTileLayer',
        'esri/layers/support/TileInfo',
        'esri/config',
        'esri/geometry/Point',
        'esri/Graphic',
        'esri/widgets/ScaleBar',
        "dojo/dom",
        "dojo/domReady"
      ]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // ...menuEvent,
    init() {
      // 加载css;
      const arcgisApiBaseUrl = Vue.prototype.ARCGIS_API_BASE_URL;
      if (arcgisApiBaseUrl) {
        // Load from local if there is
        // "http://localhost:8085/arcgis_js_api/library/4.11/esri/css/main.css";
        loadCss(`${arcgisApiBaseUrl}esri/css/main.css`);
      } else {
        loadCss();
      }

      // 加载模块
      let options = {};
      if (arcgisApiBaseUrl) {
        // http://localhost:8085/arcgis_js_api/library/4.11/dojo/dojo.js"
        options.url = `${arcgisApiBaseUrl}dojo/dojo.js`;
      }
      loadModules(this.gisModules, options).then(this.loadMap);
    },
    loadMap(args) {
      /*处理构造函数,绑定到gisConstructor,方便组件内其他地方调用*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop();
        this.gisConstructor[name] = args[k];
      }
      // 初始化地图 
      let webScene = new this.gisConstructor.WebScene({
        portalItem: {
          id: "3a9976baef9240ab8645ee25c7e9c096"
        }
      });
      let sceneView = new this.gisConstructor.SceneView({
        container: "map",
        map: webScene,
        padding: {
          top: 40
        }
      });
      let titleDiv = this.gisConstructor.dom.byId("titleDiv");
      webScene.when(function() {
        // All layers and the basemap have been created
        titleDiv.innerHTML = "Layers and basemap have been created...";
      });
      sceneView.when(function() {
        // All layer and basemap resources have been loaded and are ready to be displayed
        let title = webScene.portalItem.title;
        titleDiv.innerHTML = title;
      });

      this.webScene = webScene;
      this.sceneView = sceneView;
    },
    switchLayer(para) {
      // TODO
      this.baseLayerIndex = para.baseLayerIndex;
    }
  }
};
</script>

<style lang = "less">
  .web-scene {
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
    top: 40px;
    right: 20px;
    display: flex;
    z-index: 2;
    display: flex;
    width: 150px;
    justify-content: space-between;
    cursor: pointer;

    .switch-tool {
      width: 60px;
      height: 60px;
      border: 2px solid #fff;
      border-radius: 3px;
      opacity: 0.6;
      &:hover {
        opacity: 1;
      }
    }

    .highlight {
      border-color: #09f;
    }
  }

  #titleDiv{
    background-color: lightgray;
    color: black;
    padding: 3px;
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0; 
    font-size: 16pt;
    font-weight: bolder;
    width: 100%;
    height: 25px;
    text-align: center;
    opacity: 0.6;
  }
</style>
