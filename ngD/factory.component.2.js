var app = angular.module('myApp', [])

app.controller('e', ['$scope','Mypop', function($scope,Mypop){

	$scope.oneShow = false
	$scope.instanceTwo =false;
	$scope.instanceOne = Mypop.make({
		title: 'i am one',
		parent: 'btn1'
	});
	$scope.instanceTwo = Mypop.make({
		title: 'i am two'
	});

	$scope.oneToggle = function($event) {
		$scope.oneShow ? $scope.instanceOne.close() : $scope.instanceOne.open($event);
		$scope.oneShow = !$scope.oneShow
	}

	$scope.twoToggle = function($event) {
		$scope.twoShow ? $scope.instanceTwo.close() : $scope.instanceTwo.open($event);
		$scope.twoShow = !$scope.twoShow
	}


}])

app.factory('Mypop', ['$q','$rootScope','$compile','$timeout', function($q, $rootScope,$compile,$timeout){
	// --- 变量声明 ---
	var $ = angular.element;
	var html = html ? html : mkHTML();
	var _body = $(document.querySelector('body'))
	var win_h = document.documentElement.clientHeight;
	var win_w = document.body ? document.body.clientWidth  : document.documentElement.clientWidth ;

	// ---- 模板函数 -----
	function mkHTML() {
		return [
			"<div ng-class='{pop: true, hide: !BIRTH}' ng-style='style' >",
				"<h3>{{title}}</h3>",
			"</div>"
		].join('')
	}
 
    // ----- 构造函数 -----
	function maker(option) {
		// --- 作用域 -----
		this.scope = $rootScope.$new()
		// // --- 变量声明 ---
		var _s = this.scope
		// // --- 引用模板 ---
		_s.html = $(html)
		// --- 相关变量 ---
		_s.BIRTH = false;
		_s.title = option.title
		_s.style = {}
		// --- 相关函数 ---
		_s.close = function() {
			_s.BIRTH = false;
		}
		_s.open = function($event) {
			console.log($event)
			// --- 样式 ---
			console.log(win_w)
			console.log($event.clientX )
			var left = ($event.clientX > win_w/2) ? '' : ($event.clientX + 'px')
			var right = ($event.clientX > win_w/2) ? (win_w -$event.clientX + 'px' ) : ''
			var top = $event.clientY + 'px'
			_s.style = {
				top: top,
				left: left,
				right: right
			}
			_body.append(_s.html);
			$timeout(function(){
				_s.BIRTH = true
			}, 16)
		}
		// --- 切换才destroy ---
		// _s.$watch('stateChangeSuccess', function(){
		//  _s.html.remove();
		// 	_s.$destroy();
		// })
		// --- 编译 ---
		$compile(_s.html)(_s)
	}

	function make(option) {
		// ---- 返回实例的 scope ------
		return new maker(option).scope
		
	}

	return {
		make: make
	}
}])