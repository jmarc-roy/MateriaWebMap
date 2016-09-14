app.controller('MateriaWebMapController',
  function (
    $scope,
    $filter,
    $mdDialog,
    esriLoader,
    pins,
    categories,
    basemaps,
    mapConfiguration,
    AddCategoryService,
    EditCategoryService,
    AddPinService,
    EditPinService,
    DeletePinService,
    DeleteCategoryService,
    EsriViewService,
    MapSettingsService
  ) {
    $scope.basemaps = basemaps.data.rows
    $scope.pins = pins.data
    $scope.pinsCount = pins.data.count
    $scope.categories = categories.data.rows
    $scope.mapConfiguration = mapConfiguration.data
    $scope.MapSettingsService = MapSettingsService.initialize($scope.mapConfiguration, $scope.basemaps)
    

    $scope.AddCategoryService = AddCategoryService
    $scope.EditCategoryService = EditCategoryService.initialize()
    $scope.AddPinService = AddPinService.initialize()
    $scope.EditPinService = EditPinService
    $scope.DeletePinService = DeletePinService
    $scope.DeleteCategoryService = DeleteCategoryService
    $scope.EsriViewService = EsriViewService
    $scope.EsriViewService.initialize($scope.basemaps, $scope.pins, $scope.categories, $scope.mapConfiguration)

    $scope.EsriViewService.setView()
    
    $scope.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
  })
