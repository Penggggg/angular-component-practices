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

app.factory('toast', ['$q','$rootScope','$compile','$timeout','toastIN', function($q, $rootScope, $compile, $timeout, toastIN){
	// --- instance 维护队列 ---

	// --- 声明变量 ---
	var $ = angular.element;
	var HTML = HTML ? HTML : html();
	var _body = $(document.querySelector('body'))

	function html() {
		// --- 模板函数 ---
		return [
			"<div ng-class='{toast: true, hide: !BIRTH}' ng-style='style' >",
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
		_s.token = (new Date()).getTime()
		_s.instanceList = toastIN.showList()
		_s.style = {}
		// --- 相关函数 ---
		_s.open = function() {
			// --- 开启 ---
			_body.append(_s.html);
			$timeout(function(){ _s.BIRTH = true },16)
			// --- 自关闭 ---
			$timeout(function(){ 
				$timeout(function() {
					toastIN.shift();
				}, 200)
				_s.close() 
			}, 2500)	
		}
		_s.close = function() {
			_s.BIRTH = false
			$timeout(function(){ _s.defer.resolve() ;_s.html.remove();_s.$destroy(); }, 400)
		}
		
		_s.$watchCollection('instanceList', function(n,o) {
			for(var i = 0; i < _s.instanceList.length; i++){
				if(_s.token === _s.instanceList[i]) {
					_s.style = {top: ((i+1)*60) + 'px'}
				
				}
			}
		})
		// --- 编译 ---
		$compile(_s.html)(_s);
		// --- 初始化 ---
		$timeout(function() {
			_s.open()
		}, 16)
		// --- 加入维护队列 ---
		toastIN.add(_s.token)
	}


	function show(option) {
		// --- 只有视觉交互 返回toast后promise ---
		return new maker(option).scope.defer.promise;
	}

	return {
		show: show
	}
}])

app.factory('toastIN', ['$q','$rootScope', function($q, $rootScope){
	var scope = $rootScope.$new()
	var _sl = scope.list = []
	function showList() {
		return _sl
	}
	function add(token) {
		_sl.push(token)
		// $rootScope.$broadcast('toastAdd', _sl)
	}
	function shift() {
		if(_sl.length <= 0){ return }
		_sl.shift()
	}

	return {
		showList: showList,
		add: add,
		shift: shift
	}
}])


