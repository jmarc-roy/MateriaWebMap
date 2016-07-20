angular.module("myApp").filter("pinsByCategories", function($filter) {
  return function(input, id) {
    var newObjt = {}
    var tempTab = []
    var y = -1
    for (i in input){
      y = y+1    
      if (input[i].id_category == id){
        tempTab.push(input[i])
      }
    }
    return tempTab
  }
})
