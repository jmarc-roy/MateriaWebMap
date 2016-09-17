app.factory('EsriWidgetService', function (esriLoader, $http, $q) {
  class EsriWidget {
    constructor() {

    }
    setHomeButton(view) {
      esriLoader.require(["esri/widgets/Home"], function (Home) {
        var homeWidget = new Home({
          view: view
        })
        view.ui.add(homeWidget, "top-left");
      })
    }
    setLegend(view, layer) {
      var deffered = $q.defer()
      esriLoader.require(["esri/widgets/Legend"], function (Legend) {
        var featureLayer
        var test
        var legend = new Legend({
          view: view,
          layerInfos: [{
            layer: layer
          }]
        });
        legend.layerInfos.title = "Légende :"
        legend.title = "Légende :"
        legend.startup()
        deffered.resolve(legend)
        view.ui.add(legend, "left");
      })
      return deffered.promise
    }
    setSearchBar(view, position) {
      esriLoader.require(["esri/widgets/Search"], function (Search) {
        var searchWidget = new Search({
          view: view
        });
        view.ui.add(searchWidget, {
          position: position,
          index: 2
        });
      })
    }
  }
  let esriWidget = new EsriWidget()
  return esriWidget
});
