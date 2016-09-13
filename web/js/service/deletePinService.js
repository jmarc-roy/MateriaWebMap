app.factory("DeletePinService", function (esriLoader, $timeout, $q, $filter, $rootScope, $mdDialog, $document, $mdMedia, $state, $http, $stateParams, $mdToast) {
    class DeletePin {
        constructor() {
        }

        show(ev, pin) {
            this.pin = pin
              this.confirm = $mdDialog.confirm()
                .title('You are going to delete a location :', this.pin.name)
                .textContent('All information about this point will be definitevely lost. Are you sure?')
                .ariaLabel('Warn')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Cancel');
            $mdDialog.show(this.confirm, this.pin).then((pin) => {
                $http.delete('./api/pin/' + this.pin.id).success(() => {
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

    let deletePin = new DeletePin()
    return deletePin;
})






