app.factory("AddPinService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams) {
    class AddPin {
        constructor() {
        }

        initialize() {
            this.pin = {longitude: 0, latitude: 0}
            this.center = {}

            return this
        }

        setMapCenterCoordinate() {
            this.pin.longitude = Math.round(this.center.longitude * 100) / 100
            this.pin.latitude = Math.round(this.center.latitude * 100) / 100
        }

        show(ev, layer, center) {
            this.layer = layer
            this.center = center
            
            if (typeof this.layer.style == 'string') {
                this.layer.style = JSON.parse(this.layer.style)
            }

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen
            
            $mdDialog.show({
                locals: {
                    layer: this.layer,
                    center: this.center
                },
                controller: AddPinController,
                templateUrl: './views/template/addPin.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })

            $rootScope.$watch(() => {
                return $mdMedia('xs') || $mdMedia('sm')
            }, (wantsFullScreen) => {
                this.customFullscreen = (wantsFullScreen === true)
            })
        }

        hide() {
            $mdDialog.hide()
        }
        cancel() {
            $mdDialog.cancel()

        }

        saveEdits(pin, layer) {
            pin.id_category = layer.id

            $http.post('./api/pin/', pin).success((updatedLayer) => {
                $mdDialog.hide()
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                })
            })
        }

        answer() {
            $mdDialog.hide()
        }
    }

    let addPin = new AddPin()
    return addPin
})

function AddPinController($scope, AddPinService) {
    $scope.AddPinService = AddPinService
}





