app.factory('esriMapPoint', function(esriLoader, $http, $q) {
  return {
    addPointCollection: function(map, PointCollection, name) {
      var deffered = $q.defer()
      var extractedField = []
      var style = {}
      if (JSON.parse(PointCollection[0].style)) {
        style = JSON.parse(PointCollection[0].style)
      } else {
        style = PointCollection[0].style
      }
      for (i in PointCollection[0]) {
        var type = typeof PointCollection[0][i]
        switch (type) {
          case 'number':
            var obj = {}
            obj.name = i,
              obj.alias = i,
              obj.type = "esriFieldTypeDouble"
            extractedField.push(obj)
            break;
          case 'string':
            var obj = {}
            obj.name = i,
              obj.alias = i,
              obj.type = "esriFieldTypeString"
            extractedField.push(obj)
            break;
          case 'object':
            break;
          default:
            var obj = {}
            obj.name = i,
              obj.alias = i,
              obj.type = "esriFieldTypeString"
            extractedField.push(obj)
            break;
        }
      }

      esriLoader.require([
        'esri/Map',
        "esri/views/SceneView",
        "esri/geometry/Point",
        'esri/Graphic',
        "esri/symbols/PointSymbol3D",
        "esri/symbols/IconSymbol3DLayer",
        "esri/symbols/ObjectSymbol3DLayer",
        "esri/layers/GraphicsLayer",
        "esri/layers/FeatureLayer",
        "esri/renderers/SimpleRenderer",
        "esri/PopupTemplate",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/Color",
        "esri/symbols/LabelSymbol3D",
        "esri/symbols/TextSymbol3DLayer",
        "esri/layers/support/LabelClass",
        "esri/PopupTemplate",
        "esri/renderers/UniqueValueRenderer"
      ], function(
        Map,
        SceneView,
        Point,
        Graphic,
        PointSymbol3D,
        IconSymbol3DLayer,
        ObjectSymbol3DLayer,
        GraphicsLayer,
        FeatureLayer,
        SimpleRenderer,
        PopupTemplate,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
        Color,
        LabelSymbol3D,
        TextSymbol3DLayer,
        LabelClass,
        PopupTemplate,
        UniqueValueRenderer) {

        var GraphicCollection = []
        for (i in PointCollection) {
          var point = PointCollection[i]
          if (point.longitude && point.latitude) {
            var sitePosition = new Point(point.longitude, point.latitude)
            var singleGraphic = new Graphic({
              geometry: sitePosition,
              attributes: point
            })
            GraphicCollection.push(singleGraphic)
          }

        }
        var simplePointSym = new SimpleMarkerSymbol("STYLE_CIRCLE", 10, new Color([0, 0, 255, 0.8]))
        switch (style.rendererType) {
          case 'Simple symbol':
            var renderer = new SimpleRenderer({
              symbol: new SimpleMarkerSymbol({
                style: style.shape,
                size: style.size,
                color: style.color
              })
            })
            break;
          case '3D symbol':
            var objectSymbol = new PointSymbol3D({
              symbolLayers: [new ObjectSymbol3DLayer({
                width: style.width,
                height: style.height,
                resource: {
                  primitive: style.shape3D
                },
                material: {
                  color: style.color
                }
              })]
            });
            var renderer = new SimpleRenderer({
              symbol: objectSymbol
            })
            break;
          default:
            var renderer = new SimpleRenderer({
              symbol: new SimpleMarkerSymbol({
                style: 'circle',
                size: style.size,
                color: style.color
              })
            })
            break;
        }
        var testPoint = GraphicCollection[GraphicCollection.length - 1]
        var textSymbol = new LabelSymbol3D({
          symbolLayers: [new TextSymbol3DLayer({
            material: {
              color: style.color
            },
            size: 10
          })]
        })
        popup = new PopupTemplate()
        popup.title = name
        popup.content = ""
        var lc = new LabelClass({
          labelExpressionInfo: {
            value: "{name}"
          },
          symbol: textSymbol
        });
        var featureLayer
        featureLayer = new FeatureLayer({
          fields: extractedField,
          objectIdField: "ObjectID",
          geometryType: "point",
          spatialReference: {
            wkid: 4326
          },
          source: GraphicCollection,
          renderer: renderer,
          id: name,
          title: name,
          outFields: ["*"],
          labelsVisible: true,
          popupTemplate: popup
        });
        for (i in featureLayer.fields) {
          var field = featureLayer.fields[i]
          popup.content = popup.content + "<p><strong>" + field.name + "</strong>: <p style='color: blue;'>{" + field.name + "}</p>"
        }
        map.add(featureLayer)
        featureLayer.labelsVisible = true
        featureLayer.labelingInfo = [lc]
        featureLayer.on("layerview-create", function(result) {
          result.layerView.queryExtent().then(function(evt) {
            result.target.extent = evt.extent
          })
          deffered.resolve(result)
        })
      })
      return deffered.promise
    }
  }
});
