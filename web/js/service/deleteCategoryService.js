app.factory("DeleteCategoryService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams, $mdToast) {
    class DeleteCategory {
        constructor() {
        }

        show(ev, category) {
            this.category = category
            this.confirm = $mdDialog.confirm()
                .title('You are going to delete a location :', this.category.name)
                .textContent('All information about this point will be definitevely lost. Are you sure?')
                .ariaLabel('Warn')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Cancel');

            $mdDialog.show(this.confirm, this.category).then((category) => {
                $http.delete('./api/pins/' + this.category.id).success(() =>{ //Line to be remove => Materia issue: https://github.com/webshell/materia-designer/issues/47
                    $http.delete('./api/category/' + this.category.id).success(() => {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("operation success, reloading...")
                                .position("top right")
                                .hideDelay(1000)
                        ).then(() => {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            }).fail((err) => {
                                console.log("Err :", err)
                            });
                        })
                    })
                })
            }, () => {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("operation aborded")
                        .position("top left")
                        .hideDelay(1000)
                )
            });
        }
    }

    let deleteCategory = new DeleteCategory()
    return deleteCategory;
})






