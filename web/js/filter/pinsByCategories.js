angular.module("myApp").filter("pinsByCategories", function($filter) {
  return function(input, id) {
    let newObjt = {},
      tempTab = [],
      y = 0

    for (let i in input) {
      if (input[i].id_category == id) {
        tempTab.push(input[i])
      }
      y++    
    }

    return tempTab
  }
})
