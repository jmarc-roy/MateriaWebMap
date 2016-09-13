app.factory("AddCategoryService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams) {
    class AddCategory {
        constructor() {
        }

        initialize() {
            this.layer = {}
            this.state = {}

            return this
        }

        show(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
            $mdDialog.show({
                controller: AddCategoryTmplController,
                templateUrl: './views/template/addCategory.tmpl.html',
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
            this.layer.style = JSON.stringify(category.style)
            $http.post('./api/category/', this.layer).success((updatedLayer) => {
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

    let addCategory = new AddCategory()
    return addCategory;
})

function AddCategoryTmplController($scope, AddCategoryService) {
    $scope.AddCategoryService = AddCategoryService
}
