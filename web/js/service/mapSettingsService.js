app.factory("MapSettingsService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams) {
    class MapSettings {
        constructor() {
        }

        initialize(config, basemaps) {
            this.config = config
            this.basemaps = basemaps
            return this
        }

        show(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
            $mdDialog.show({
                controller: MapSettingsTmplController,
                templateUrl: './views/template/mapSettings.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function() {}, function () {})

            $rootScope.$watch(() => {
                return $mdMedia('xs') || $mdMedia('sm');
            }, (wantsFullScreen) => {
                this.customFullscreen = (wantsFullScreen === true);
            })
        }
        hide() {
            $mdDialog.hide()
        }
        cancel() {
            $mdDialog.cancel()

        }
        saveEdits(category) {
            console.log("Save :", this.config)
            $http.put('./api/map/settings/' + this.config.id, this.config).success((updatedLayer) => {
                $mdDialog.cancel()
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                }).fail(function (err) {
                    console.log("Err :", err)
                });
            })
        }

        answer() {
            $mdDialog.hide();
        }
    }

    let mapSettings = new MapSettings()
    return mapSettings;
})

function MapSettingsTmplController($scope, MapSettingsService, EsriViewService) {
    $scope.MapSettingsService = MapSettingsService
    $scope.EsriViewService = EsriViewService
}
