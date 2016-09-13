app.factory("EditPinService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams) {
    class EditPin {
        constructor() {
        }

        initialize() {
            this.center = {}
            this.layer = {}

            return this
        }

        setMapCenterCoordinate() {
            console.log("Set map CENTER COORDINATE :", this.center.longitude, this.center.latitude, this.center.longitude)
            this.pin.longitude = Math.round(this.center.longitude * 100) / 100
            this.pin.latitude = Math.round(this.center.latitude * 100) / 100
        }

        show(ev, pin) {
            this.pin = pin
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
            $mdDialog.show({
                locals: {
                    pin: this.pin
                },
                controller: EditPinController,
                templateUrl: './views/template/editPin.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
                .then(function (layer) {

                }, function () {
                    var status = 'You cancelled the dialog.';
                });

            $rootScope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, (wantsFullScreen) => {
                this.customFullscreen = (wantsFullScreen === true);
            });
        }
        hide() {
            $mdDialog.hide()
        }
        cancel() {
            $mdDialog.cancel()

        }
        saveEdits(category) {
            $http.put('./api/pin/' + category.id, category).success(function (updatedLayer) {
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

    let editPin = new EditPin()
    return editPin;
})

function EditPinController($scope, EditPinService) {
    $scope.EditPinService = EditPinService
}








