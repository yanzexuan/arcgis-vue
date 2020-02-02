import { loadCss, loadModules } from 'esri-loader'
import tileInfo from '../util/tileInfo'
import Footer from '../components/Footer'

export default {
  name: 'BaseMap',
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
      // 加载css;
      loadCss()
      // 加载模块
      loadModules(this.gisModules).then(this.loadMap)
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
          wkid: 4326
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
        scale: 7000000,
        center: [111.42610500035, 33.76651600041],
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
      let result = this.gisConstructor.WebTileLayer(
        'http://{subDomain}.tianditu.com/DataServer?T=' + mapType +
                '&X={col}&Y={row}&L={level}' +
                '&tk=66d02bbbc3baa840bc20af7b4803bd6c',
        {
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