var app = angular.module('myApp', [])

app.controller('e', ['$scope','MyService', function($scope, MyService){
	
	$scope.get = function() {
		MyService.test()
			.then(function(msg) {
				$scope.sayHi = msg
			})
	}

}])

app.factory('MyService', ['$q', '$timeout', function($q, $timeout){
	function test() {
		var defer = $q.defer()
		$timeout(function() {
			defer.resolve('done')
		}, 2000)
		return defer.promise;
	}
	return {
		test: test
	}
}])