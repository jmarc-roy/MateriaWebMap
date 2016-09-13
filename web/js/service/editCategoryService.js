app.factory("EditCategoryService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams) {
    class EditCategory {
        constructor() {
        }

        initialize() {
            this.options = {
                format: 'hex'
            }
            return this
        }

        show(ev, layer) {
            this.layer = layer
            if (typeof this.layer.style == 'string') {
                this.layer.style = JSON.parse(this.layer.style)
            }
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
            $mdDialog.show({
                locals: {
                    layer: this.layer
                },
                controller: EditCategoryTmplController,
                templateUrl: './views/template/editCategory.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
                .then(function (layer) {

                }, function () {
                    $scope.status = 'You cancelled the dialog.';
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
        saveEdits(layer) {
            var newLayer = {}
            newLayer.name = this.layer.name
            newLayer.id = this.layer.id
            newLayer.style = JSON.stringify(this.layer.style)
            $http.put('./api/category/' + newLayer.id, newLayer).success(function (updatedLayer) {
                $mdDialog.hide()
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            })
        }

        answer() {
            $mdDialog.hide();
        }
    }

    let editCategory = new EditCategory()
    return editCategory;
})

function EditCategoryTmplController($scope, EditCategoryService) {
    $scope.EditCategoryService = EditCategoryService
}


