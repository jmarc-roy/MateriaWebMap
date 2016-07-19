app.factory('esriMapWidget', function(esriLoader, $http, $q) {
  return {
    homeButton: function(view) {
      esriLoader.require(["esri/widgets/Home"], function(Home) {
        var homeWidget = new Home({
          view: view
        })
        view.ui.add(homeWidget, "top-left");
      })
    },
    Legend: function(view, layer) {
      var deffered = $q.defer()
      esriLoader.require(["esri/widgets/Legend"], function(Legend) {
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
        view.ui.add(legend, "middle-left");
      })
      return deffered.promise
    },
    search: function(view) {
      esriLoader.require(["esri/widgets/Search"], function(Search) {
        var searchWidget = new Search({
          view: view
        });
        // Adds the search widget below other elements in
        // the top left corner of the view
        view.ui.add(searchWidget, {
          position: "top-right",
          index: 2
        });
      })
    }
  }
});
