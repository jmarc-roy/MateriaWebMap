var app = angular.module("myApp", [
  'ui.router',
  'ngMaterial',
  'ngMessages',
  'esri.map',
  'color.picker'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {
  $mdThemingProvider.theme('data')
    .primaryPalette('grey', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
  $mdThemingProvider.theme('environnement')
    .primaryPalette('green', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
  $urlRouterProvider.otherwise("/materia-web-map")
  $stateProvider.state('home', {
      url: '/materia-web-map',
      templateUrl: "./views/materiaWebMap.html",
      controller: "MateriaWebMapController",
      resolve: {
        pins: function($http, $stateParams) {
          return $http.get('./api/pins')
        },
        categories: function($http){
          return $http.get('./api/categories')
        },
        basemaps: function($http){
          return $http.get('./api/basemaps')
        }
      }
    })
    //$locationProvider.html5Mode(true)
}).run(function() {

})
