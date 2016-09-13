app.factory("EsriViewService", function (esriLoader, $q, esriMapWidget, $filter, esriMapPoint, $rootScope) {
    class EsriView {
        constructor() {
        }
        initialize(basemaps, pins, categories) {
            this.categories = categories
            this.basemaps = basemaps
            this.pins = pins
        }
        setMap() {
            var deffered = $q.defer()
            esriLoader.require(["esri/Map"], (Map) => {
                this.map = new Map({
                    basemap: "hybrid",
                    ground: "world-elevation",
                    basemapTemplateUrl: ""
                });
                deffered.resolve(this.map)
            })
            return deffered.promise
        }
        setView() {
            this.setMap().then(() => {
                esriLoader.require(["esri/views/SceneView"], (SceneView) => {
                    this.view = new SceneView({
                        container: "viewDiv",
                        map: this.map,
                        zoom: 6,
                        center: [1, 47],
                        heading: 30,
                        tilt: 20
                    });
                    this.view.then((view) => {
                        this.view = view
                        this.view.goTo({
                            center: [1, 47],
                            zoom: 7,
                            heading: 30,
                            tilt: 60
                        })
                        this.center = this.view.center
                        this.setBasemap(this.basemaps)
                        this.addPointCollection(this.categories, this.pins)
                        this.addWidget()
                        this.view.watch('center', () => {
                            this.center = this.view.center
                            $rootScope.$applyAsync('center');
                        })
                    })
                })
            })
            return this.view
        }
        changeBasemap(newBasemap) {
            this.map.basemap = newBasemap.name
            this.map.basemapTemplateUrl = newBasemap.templateUrl
        }
        addWidget() {
            esriMapWidget.search(this.view)
            esriMapWidget.Legend(this.view)
        }
        changeLayerVisibility(layer) {
            layer.visible = !layer.visible;
            for (let i in this.map.allLayers.items) {
                if (this.map.allLayers.items[i].id == layer.name) {
                    this.map.allLayers.items[i].visible = !this.map.allLayers.items[i].visible
                }
            }

        }
        zoomIn(lng, lat) {
            esriLoader.require([
                "esri/geometry/Point"
            ], (Point) => {
                var point = new Point(lng, lat)
                this.view.goTo({
                    target: point,
                    zoom: 10,
                    tilt: 43
                })
            })
        }
        zoomToExtent(layer) {
            for (let i in this.map.allLayers.items) {
                if (this.map.allLayers.items[i].id == layer.name) {
                    view.goTo({
                        target: this.map.allLayers.items[i].extent
                    })
                }
            }
        }
        addPointCollection(categories, pins) {
            var dataSets = []
            for (let i in categories) {
                var category = categories[i]
                if (category) {
                    var categoryDataset = $filter('pinsByCategories')(pins, category.id)
                    if (categoryDataset.length >= 0) {
                        dataSets.push(categoryDataset)
                        esriMapPoint.addPointCollection(this.map, categoryDataset, category.name).then((layer) => {
                        })
                    }
                }
            }
        }
        setBasemap(basemaps) {
           basemaps.forEach((basemap) => {
                if (basemap.name == 'hybrid') {
                    this.map.basemap = basemap.name
                    this.map.basemapTemplateUrl = basemap.templateUrl
                }
           })
        }
    }
    let esriView = new EsriView()
    return esriView;

})





