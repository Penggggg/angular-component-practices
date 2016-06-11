var app = angular.module('myApp', [])

app.controller('e', ['$scope', 'toast', function($scope, toast){
	$scope.showToast = function() {
		toast.show({
			title: '我是一个大傻逼'
		}).then(function() {
			console.log('removing...')
		})
	}
}])

app.factory('toast', ['$q','$rootScope','$compile','$timeout','toastInstance', function($q, $rootScope, $compile, $timeout,toastInstance){

	// --- 声明变量 ---
	var $ = angular.element;
	var HTML = HTML ? HTML : html();
	var _body = $(document.querySelector('body'))

	function html() {
		// --- 模板函数 ---
		return [
			"<div ng-class='{toast: true, hide: !BIRTH}' >",
				"{{title}}",
			"</div>"
		].join('')
	}


	function maker(option) {
		// --- 构造函数 ---
		// --- 作用域 ---
		var _s = this.scope = $rootScope.$new();
		// --- 相关变量 ---
		_s.BIRTH = false;
		_s.html = $(HTML);
		_s.title = option.title;
		_s.defer = $q.defer()
		// --- 相关函数 ---
		_s.open = function() {
			// --- 开启 ---
			_body.append(_s.html);
			$timeout(function(){ _s.BIRTH = true },16)
			// $timeout(function(){ _s.close() }, 2500)
		}
		_s.close = function() {
			_s.BIRTH = false
			$timeout(function(){ _s.defer.resolve() ;_s.html.remove();_s.$destroy(); }, 400)
		}
		// --- 编译 ---
		$compile(_s.html)(_s);
		// --- 初始化 ---
		$timeout(function() {
			_s.open()
		}, 16)
	}

	function show(option) {
		// --- 只有视觉交互 返回toast后promise ---
		return new maker(option).scope.defer.promise;
	}

	return {
		show: show
	}
}])

app.factory('toastInstance', ['$q', function($q){
	var list = []
	return {
		list: list
	}
}])