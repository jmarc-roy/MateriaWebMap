app.factory("EsriPointService", function (esriLoader, $q, $filter) {
    class EsriPoint {
        constructor() {
        }
        initialize() {
           
            return this
        }
        createFeatureLayer(map, pointCollection, name, layerSource) {
            this.map = map
            this.pointLayer = {}
            
            console.log(JSON.parse(pointCollection[0].style), layerSource)
            var style = {}
            if (JSON.parse(pointCollection[0].style)) {
                this.style = JSON.parse(pointCollection[0].style)
                style = this.style
                for (let i in layerSource) {
                    if (layerSource[i].id == pointCollection[0].id_category)
                        layerSource[i].style = style
                }

                for (let i in pointCollection) {
                    pointCollection[i].style = style
                }
            } else {
                style = pointCollection[0].style
            }
            this.extractedFields = this.getFields(pointCollection)
            return $q((resolve, reject) => {
                this.createLabellingInfo(pointCollection[0].style).then(() => {
                    this.createPopupWindow(name).then(() => {
                        this.getGeometryCollection(pointCollection).then((GraphicCollection) => {
                            this.GraphicCollection = GraphicCollection
                            this.getRenderer(pointCollection[0].style).then(() => {
                                esriLoader.require(["esri/layers/FeatureLayer"], (FeatureLayer) => {
                                    
                                    this.pointLayer = new FeatureLayer({
                                        fields: this.extractedFields,
                                        objectIdField: "ObjectID",
                                        geometryType: "point",
                                        spatialReference: {
                                            wkid: 4326
                                        },
                                        source: this.GraphicCollection,
                                        renderer: this.renderer,
                                        id: name,
                                        title: name,
                                        outFields: ["*"],
                                        labelsVisible: true,
                                        popupTemplate: this.popup,
                                        labelingInfo: this.lc
                                       
                                    });
                                   
                                    this.map.add(this.pointLayer)
                                  
                                    this.pointLayer.on("layerview-create", function (result) {
                                        result.layerView.queryExtent().then(function (evt) {
                                            result.target.extent = evt.extent
                                        })
                                        resolve(result)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
        createPopupWindow(layerName) {
            var deffered = $q.defer()
   
            esriLoader.require(["esri/PopupTemplate"], (PopupTemplate) => {
                this.popup = new PopupTemplate()
                this.popup.title = layerName
                this.popup.content = ""
                for (let i in this.extractedFields) {
                    var field = this.extractedFields[i]
           
                    this.popup.content = this.popup.content + "<p>" + field.name + " : {" + field.name + "} </p>"
                }

                deffered.resolve(this.popup)
            })
            return deffered.promise
        }
        getFields(pointCollection) {
            this.extractedFields = []
            
            for (let i in pointCollection[0]) {
                var type = typeof pointCollection[0][i]
                switch (type) {
                    case 'number':
                        var obj = {
                            name: i,
                            alias: i,
                            type: "esriFieldTypeDouble"
                        }
                        this.extractedFields.push(obj)
                        break;
                    case 'string':
                        var obj = {
                            name: i,
                            alias: i,
                            type: "esriFieldTypeString"
                        }
                        this.extractedFields.push(obj)
                        break;
                    case 'object':
                        break;
                    default:
                        var obj = {
                            name: i,
                            alias: i,
                            type: "esriFieldTypeString"
                        }
                        this.extractedFields.push(obj)
                        break;
                }
            }
            return this.extractedFields
        }
        getGeometryCollection(pointCollection) {
            var deffered = $q.defer()
            var GraphicCollection = []
            esriLoader.require(["esri/geometry/Point", "esri/Graphic"], (Point, Graphic) => {
                for (let x in pointCollection) {
                    ((i) => {
                        var point = pointCollection[i]
                        if (point.longitude && point.latitude) {
                            var sitePosition = new Point(point.longitude, point.latitude)
                            var singleGraphic = new Graphic({
                                geometry: sitePosition,
                                attributes: point
                            })
                            GraphicCollection.push(singleGraphic)
                        }
                    })(x)
                }
                console.log("Graphic collection :", GraphicCollection)
                deffered.resolve(GraphicCollection)
            })
            return deffered.promise
        }
        getRenderer(style) {
            var deffered = $q.defer()
         
            esriLoader.require(["esri/renderers/SimpleRenderer", "esri/symbols/PointSymbol3D", "esri/symbols/ObjectSymbol3DLayer", "esri/symbols/SimpleMarkerSymbol"], (SimpleRenderer, PointSymbol3D, ObjectSymbol3DLayer, SimpleMarkerSymbol) => {
                switch (style.rendererType) {
                    case 'Simple symbol':
                        this.renderer = new SimpleRenderer({
                            symbol: new SimpleMarkerSymbol({
                                style: this.style.shape,
                                size: this.style.size,
                                color: this.style.color
                            })
                        })
                        break;
                    case '3D symbol':
                        var objectSymbol = new PointSymbol3D({
                            symbolLayers: [new ObjectSymbol3DLayer({
                                width: this.style.width,
                                height: this.style.height,
                                resource: {
                                    primitive: this.style.shape3D
                                },
                                material: {
                                    color: this.style.color
                                }
                            })]
                        });
                        this.renderer = new SimpleRenderer({
                            symbol: objectSymbol
                        })
                        break;
                    default:
                        this.renderer = new SimpleRenderer({
                            symbol: new SimpleMarkerSymbol({
                                style: 'circle',
                                size: style.size,
                                color: style.color
                            })
                        })
                        break;
                }
   
                deffered.resolve(this.renderer)
               
            })
            return deffered.promise
        }
        addLayerToMap() {
            EsriViewService.map.add(this.pointLayer)
        }
        createLabellingInfo(style) {
            var deffered = $q.defer()
           
            esriLoader.require(["esri/symbols/LabelSymbol3D", "esri/symbols/TextSymbol3DLayer", "esri/layers/support/LabelClass","esri/symbols/IconSymbol3DLayer"], (LabelSymbol3D, TextSymbol3DLayer, LabelClass, IconSymbol3DLayer) => {
                var textSymbol = new LabelSymbol3D({
                    symbolLayers: [new TextSymbol3DLayer({
                        material: {
                            color: style.color
                        },
                        size: 10
                    })]

                })
                var lc = new LabelClass({
                    labelExpressionInfo: {
                        value: "{name}"
                    },
                    symbol: textSymbol
                });
                this.lc = [lc]
                 deffered.resolve(this.lc)
            })
            
            return deffered.promise
        }
    }
    let esriPoint = new EsriPoint()
    return esriPoint;

})






