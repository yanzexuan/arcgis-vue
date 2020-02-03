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

<script>
import { loadCss, loadModules } from 'esri-loader'
import tileInfo from '../util/tileInfo'
import Footer from '../components/Footer'
import Vue from 'vue'

export default {
  name: 'baseMap',
  components: {
    Footer
  },
  data() {
    return {
      map: Object, // arcgis Map instance
      mapView: Object, // arcgis MapView instance
      baseLayerIndex: 0, // 用于指定当前底图
      gisConstructor: {}, //gis 构造函数
      layerID: {},
      layersInstance: {},
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/layers/WebTileLayer',
        'esri/layers/support/TileInfo',
        'esri/config',
        'esri/geometry/Point',
        'esri/Graphic',
        'esri/widgets/ScaleBar',
        'dojo/domReady!'
      ]
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
        // "http://localhost:8085/arcgis_js_api/library/4.11/esri/css/main.css"
        loadCss(`${arcgisApiBaseUrl}esri/css/main.css`)
      } else {
        loadCss()
      }

      // 加载模块
      let options = {}
      if (arcgisApiBaseUrl) {
        // http://localhost:8085/arcgis_js_api/library/4.11/dojo/dojo.js"
        options.url = `${arcgisApiBaseUrl}dojo/dojo.js`
      }
      loadModules(this.gisModules, options).then(this.loadMap)
    },
    loadMap(args) {
      // console.log(args);
      let container = this.$refs.map

      /*处理构造函数,绑定到gisConstructor,方便组件内其他地方调用*/
      for (let k in args) {
        let name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
      /*初始化各种图层*/
      let cva_c = this.initYiledLayer('cva_c')//矢量注记
      let vec_c = this.initYiledLayer('vec_c')//矢量底图

      let cia_c = this.initYiledLayer('cia_c')//影像注记
      let img_c = this.initYiledLayer('img_c')//影像地图

      this.layersInstance.cva_c = cva_c
      this.layersInstance.vec_c = vec_c

      this.layersInstance.cia_c = cia_c
      this.layersInstance.img_c = img_c

      /*初始化地图*/
      let map = new this.gisConstructor.Map({
        spatialReference: {
          wkid: 4326 // 3857 doesn't work, why?
        },
        basemap: {
          baseLayers: [this.layersInstance.vec_c, this.layersInstance.cva_c]
        }
      })
      this.baseLayerIndex = 0 // 初始化时，默认打开矢量底图

      let mapView = new this.gisConstructor.MapView({
        container: container,
        spatialReference: {
          wkid: 4326
        },
        map: map,
        scale: 10000000,
        center: [104, 35],
      })

      this.map = map
      this.mapView = mapView

      // Add scale bar widget
      let scaleBar = new this.gisConstructor.ScaleBar({
        view: mapView,
        element: document.createElement('div')
      })
      mapView.ui.add(scaleBar, 'bottom-left')
    },
    switchLayer(para) {
      if (para.baseLayerIndex === 0) {
        this.map.layers.add(this.layersInstance.vec_c)
        this.map.layers.add(this.layersInstance.cva_c)

        this.map.layers.remove(this.layersInstance.img_c)
        this.map.layers.remove(this.layersInstance.cia_c)

      } else if (para.baseLayerIndex === 1){
        this.map.layers.add(this.layersInstance.img_c)
        this.map.layers.add(this.layersInstance.cia_c)

        this.map.layers.remove(this.layersInstance.vec_c)
        this.map.layers.remove(this.layersInstance.cva_c)
      } else {
        // console.err('Wrong baseLayerIndex!');
      }
      this.baseLayerIndex = para.baseLayerIndex
    },
    initYiledLayer(mapType) {
      let url = 'http://{subDomain}.tianditu.com/DataServer?T=' + mapType +
        '&X={col}&Y={row}&L={level}' +
        '&tk=66d02bbbc3baa840bc20af7b4803bd6c'
      let result = this.gisConstructor.WebTileLayer(url, {
        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        tileInfo: tileInfo,
        spatialReference: {
          wkid: 4326
        },
      })

      this.layerID[mapType] = result.id
      return result
    },
    /*获取扬州市行政区划*/
    textGraphic(para) {
      let point = new this.gisConstructor.Point({
        longitude: para.lon,
        latitude: para.lat
      })
      let textSymbol = {
        type: 'text',  // autocasts as new TextSymbol()
        color: [226, 0, 40], // RGB color values as an array
        text: para.text,
        font: {  // autocasts as new Font()
          size: 18
        }
      }

      return new this.gisConstructor.Graphic({
        symbol: textSymbol,
        geometry: point
      })
    }
  }
}
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
