app.controller('MateriaWebMapController',
  function (
    $scope,
    $filter,
    $mdDialog,
    esriLoader,
    pins,
    categories,
    basemaps,
    AddCategoryService,
    EditCategoryService,
    AddPinService,
    EditPinService,
    DeletePinService,
    DeleteCategoryService,
    EsriViewService
  ) {
    $scope.basemaps = basemaps.data.rows
    $scope.pins = pins.data
    $scope.pinsCount = pins.data.count
    $scope.categories = categories.data.rows

    $scope.AddCategoryService = AddCategoryService
    $scope.EditCategoryService = EditCategoryService.initialize()
    $scope.AddPinService = AddPinService.initialize()
    $scope.EditPinService = EditPinService
    $scope.DeletePinService = DeletePinService
    $scope.DeleteCategoryService = DeleteCategoryService
    $scope.EsriViewService = EsriViewService
    $scope.EsriViewService.initialize($scope.basemaps, $scope.pins, $scope.categories)

    $scope.EsriViewService.setView()
    
    $scope.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  })
