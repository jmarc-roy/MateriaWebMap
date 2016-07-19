angular.module("myApp").filter("pinsByCategories", function($filter) {
  return function(input, id) {
    console.log("in pins filter :", input, id)
    var newObjt = {}
    var tempTab = []
    var y = -1
    for (i in input){
      y = y+1
      console.log("Input i :", input[i], input[i].id_category)
      if (input[i].id_category == id){
        tempTab.push(input[i])
      }
    }
    return tempTab
  }
})
