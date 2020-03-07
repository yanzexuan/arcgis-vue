<template>
  <div class="web-scene">
    <div class = "tool-btn">
      <div :class = "{'switch-tool': true, 'highlight': basemap === 'topo'}" 
        @click = "switchLayer({basemap: 'topo', msg: 'topo'})">
        <img src = "../assets/vec_c.png" alt = "" width = "100%">
      </div>
      <div :class = "{'switch-tool': true, 'highlight': basemap === 'satellite'}"
        @click = "switchLayer({basemap: 'satellite', msg: 'satellite'})">
        <img src = "../assets/img-c.png" alt = "" width = "100%">
      </div>
    </div>

    <div ref="map" id="map" class="map">
      <div id="titleDiv">Loading...</div>
    </div>

    <el-card class="layer-manager">
      <el-checkbox v-for="l in layers" :label="l.name" :key="l.id"
        v-model="l.checked"
        class="layer-item"
        @change="toggleLayer(l.id, $event)">
        {{l.name}}
      </el-checkbox>
    </el-card>
    <Footer />
  </div>
</template>

<script>
import { loadCss, loadModules } from 'esri-loader'
import Footer from '../components/Footer'
import Vue from 'vue'

// https://developers.arcgis.com/javascript/latest/api-reference/esri-WebScene.html

export default {
  name: 'bim',
  components: {
    Footer
  },
  data() {
    return {
      map: Object, // arcgis map instance
      sceneView: Object, // arcgis SceneView instance
      basemap: 'hybrid', // 用于指定当前底图
      gisConstructor: {}, //gis 构造函数
      gisModules: [
        'esri/config',
        "dojo/dom",
        "dojo/domReady!",
        'esri/geometry/Point',
        'esri/Graphic',
        'esri/layers/BuildingSceneLayer',
        "esri/layers/FeatureLayer",
        "esri/layers/GraphicsLayer",
        "esri/layers/MapImageLayer",
        'esri/layers/support/TileInfo',
        'esri/layers/SceneLayer',
        'esri/layers/WebTileLayer',
        'esri/Map',
        // 'esri/views/MapView',
        "esri/views/SceneView",
        "esri/widgets/LayerList",
        'esri/widgets/ScaleBar',
        "esri/WebScene",
      ],
      layers: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // ...menuEvent,
    init() {
      // 加载css
      const arcgisApiBaseUrl = Vue.prototype.ARCGIS_API_BASE_URL
      if (arcgisApiBaseUrl) {
        // Load from local if there is
        // "http://localhost:8088/arcgis_js_api/library/4.11/esri/css/main.css"
        loadCss(`${arcgisApiBaseUrl}esri/css/main.css`)
      } else {
        loadCss()
      }

      // 加载模块
      let options = {}
      if (arcgisApiBaseUrl) {
        // http://localhost:8088/arcgis_js_api/library/4.11/dojo/dojo.js"
        options.url = `${arcgisApiBaseUrl}dojo/dojo.js`
      }
      loadModules(this.gisModules, options).then(this.loadWebScene)

      this.initLayers()
    },
    initLayers() {
      this.layers = [
        {
          id: "0",
          name: "SceneLayer (Streetnetwork)",
          checked: false,
          type: "SceneLayer",
          url: "http://gis.cloud.com/arcgis/rest/services/Hosted/Streetnetwork_ProcedurallyGeneratedMultipatches/SceneServer"
        },
        {
          id: "1",
          name: "SceneLayer (Building_Hamburg)",
          checked: false,
          type: "SceneLayer",
          url: "http://scene.arcgis.com/arcgis/rest/services/Hosted/Building_Hamburg/SceneServer/layers/0"
        },
        {
          id: "2",
          name: "MapImageLayer (Buildings_4326)",
          checked: false,
          type: "MapImageLayer",
          url: "https://gis.cloud.com/arcgis/rest/services/Buildings_4326/MapServer"
        },
        {
          id: "3",
          name: "Trailheads point feature layer",
          checked: false,
          type: "FeatureLayer",
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
        },
        {
          id: "4",
          name: "Trails feature layer (lines)",
          checked: false,
          type: "FeatureLayer",
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
        },
        {
          id: "5",
          name: "Parks and open spaces (polygons)",
          checked: false,
          type: "FeatureLayer",
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
        },
        {
          id: "6",
          name: "GraphicsLayer",
          checked: false,
          type: "GraphicsLayer",
          url: ""
        },
        {
          id: "7",
          name: "Small Building (BIM)",
          checked: false,
          type: "BuildingSceneLayer",
          url: "https://tiles.arcgis.com/tiles/slkrA3jrc3XaGIrp/arcgis/rest/services/small_house/SceneServer"
        }
      ]
    },
    initGisConstructors(args) {
      /*处理构造函数,绑定到gisConstructor,方便组件内其他地方调用*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
    },
    loadWebScene(args) {
      this.initGisConstructors(args)

      // 初始化地图
      let map = new this.gisConstructor.Map({
        basemap: this.basemap,
        ground: 'world-elevation' // show elevation
      })
      let sceneView = new this.gisConstructor.SceneView({
        container: "map",
        map: map,
        // scale: 20000000,
        // center: [104, 35],
        padding: {
          top: 40
        },
        camera: {
          position: {
            // observation point
            x: 104,
            y: 35,
            z: 10000000 // altitude in meters
          },
          tilt: 0 // perspective in degrees
        }
      })
      let titleDiv = this.gisConstructor.dom.byId("titleDiv")
      sceneView.when(function() {
        // All layer and basemap resources have been loaded and are ready to be displayed
        titleDiv.innerHTML = 'BIM'
      })

      // Add a layer list widget
      const layerList = new this.gisConstructor.LayerList({
        view: sceneView
      })
      sceneView.ui.add(layerList, 'top-left')

      this.map = map
      this.sceneView = sceneView
    },
    switchLayer(para) {
      // TODO
      this.basemap = para.basemap
      this.map.basemap = para.basemap
    },
    toggleLayer(layerId, checked) {
      let layer = null
      // find the layer by id
      for (let i = 0; i < this.layers.length; ++i) {
        if (layerId === this.layers[i].id) {
          layer = this.layers[i]
          break
        }
      }
      // check if the layer already added into map
      let layerExists = false
      this.map.layers.forEach(l => {
        if (l.title === layer.title) {
          l.visible = checked // if exists, don't add/remove it, show/hide it instead
          layerExists = true
        }
      })
      if (layerExists) {
        return
      }

      if (checked) {
        let newLayer = null
        if (layer.type === "SceneLayer") {
          newLayer = new this.gisConstructor.SceneLayer({ url: layer.url })
          this.map.add(newLayer)
        } else if (layer.type === "MapImageLayer") {
          // 注意在全球场景中支持WGS84坐标系和Web墨卡托坐标系，WGS84对应的代号是4326
          newLayer = new this.gisConstructor.MapImageLayer({ url: layer.url })
          this.map.add(newLayer)
        } else if (layer.type === "FeatureLayer") {
          newLayer = new this.gisConstructor.FeatureLayer({ url: layer.url })
          // TODO: How to add a FeatureLayer to WebScene, rather than to Map?
          this.map.add(newLayer)
        } else if (layer.type === "GraphicsLayer") {
          // 在scene上构建Graphic层
          newLayer = new this.gisConstructor.GraphicsLayer()
          this.map.add(newLayer)
        } else if (layer.type === "BuildingSceneLayer") {
          newLayer = new this.gisConstructor.BuildingSceneLayer({ url: layer.url })
          this.map.add(newLayer)
          newLayer.when(() => {
            this.sceneView.goTo(newLayer.fullExtent)
            layer.title = newLayer.title
          })
        } else {
          console.err(`Layer type for ${layer.type} is not supported yet!`)
          return
        }
      }
    }
  }
}
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

  #titleDiv {
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

  .layer-manager {
    position: absolute;
    top: 120px;
    right: 20px;
    display: flex;
    background: white;
    padding: 3px;
    opacity: 0.6;
    &:hover {
      opacity: 1;
    }
    .layer-item {
      display: block;
      margin: 3px;
    }
  }
</style>
