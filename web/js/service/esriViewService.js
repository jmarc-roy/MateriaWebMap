app.factory("EsriViewService", function ($q, $rootScope, $filter, esriLoader, EsriWidgetService, EsriPointService, MapSettingsService) {
    class EsriView {
        constructor() {
        }
        initialize(basemaps, pins, categories, config) {
            this.categories = categories
            this.basemaps = basemaps
            this.pins = pins
            this.config = config
        }
        _setMap() {
            var deffered = $q.defer()
            esriLoader.require(["esri/Map"], (Map) => {
                this.map = new Map({
                    basemap: this.config.basemap,
                    ground: "world-elevation",
                    basemapTemplateUrl: ""
                });
                deffered.resolve(this.map)
            })
            return deffered.promise
        }
        setView() {
            var deffered = $q.defer()
            this._setMap().then(() => {
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
                        deffered.resolve()
                        this.view = view
                        this.view.goTo({
                            center: [this.config.longitude, this.config.latitude],
                            zoom: this.config.zoom,
                            heading: this.config.heading,
                            tilt: this.config.tilt
                        })
                        this.center = this.view.center
                        this._setBasemap(this.basemaps)
                        this.addPointCollection(this.categories, this.pins)
                        this.addWidget()
                        this.view.watch('center', () => {
                            this.center = this.view.center
                            $rootScope.$applyAsync('center');
                        })
                    })
                })
            })
            return deffered.promise
        }
        setDefaultMapSettings() {
            console.log("In esriView mapSettings :", this.map.basemap)
            MapSettingsService.config = {
                zoom: Math.round(this.view.zoom * 100) / 100,
                latitude: Math.round(this.view.center.latitude * 100) / 100,
                longitude: Math.round(this.view.center.longitude * 100) / 100,
                heading: Math.round(this.view.camera.heading * 100) / 100,
                tilt: Math.round(this.view.camera.tilt * 100) / 100,
                basemap: this.map.basemap.id,
                id: 1
            }
            console.log(MapSettingsService.config)
        }
        changeBasemap(newBasemap) {
            this.map.basemap = newBasemap.name
            this.map.basemapTemplateUrl = newBasemap.templateUrl
        }
        addWidget() {
            EsriWidgetService.setSearchBar(this.view, "top-right")
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
            this._addPoint(0, categories, pins)
        }

        _addPoint(i, categories, pins) {
            let category = categories[i]
            if (category) {
                var categoryDataset = $filter('pinsByCategories')(pins, category.id)
                console.log(categoryDataset)
                if (categoryDataset.length >= 1) {
                    EsriPointService.createFeatureLayer(this.map, categoryDataset, category.name, this.categories).then(() => {
                        if (++i < categories.length) {
                            this._addPoint(i, categories, pins)
                        }
                    })
                }
            }
        }

        _setBasemap(basemaps) {
            basemaps.forEach((basemap) => {
                if (basemap.name == this.config.basemap) {
                    this.map.basemap = basemap.name
                    this.map.basemapTemplateUrl = basemap.templateUrl
                }
            })
        }
    }
    let esriView = new EsriView()
    return esriView;
})