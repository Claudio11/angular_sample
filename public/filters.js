var filters = angular.module('CEPExample.filters',[]);

filters.filter('searchFor', function(){

	// All filters must return a function. The first parameter
	// is the data that is to be filtered, and the second is an
	// argument that may be passed with a colon (searchFor:searchString)

	return function(arr, searchString){

		if(!searchString){
			return arr;
		}

		var result = [];

		searchString = searchString.toLowerCase();

		angular.forEach(arr, function(item){
			if(item.name && item.name.toLowerCase().indexOf(searchString) !== -1){
				result.push(item);
			}
		});

		return result;
	};

});