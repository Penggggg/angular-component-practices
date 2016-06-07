 var app = angular.module('myApp', [])

 app.controller('e', ['$scope', 'MyToast', function($scope, MyToast){
 	
 	$scope.inistanceOne = null;
 	$scope.inistanceTwo = null;

 	$scope.get1 = function() {
 		$scope.inistanceOne = MyToast.show({
 			title: 'hzp'
 		}).then(function(res) {
 			console.log(res)
 		})
 	}
 	$scope.get2 = function() {
 		$scope.inistanceTwo = MyToast.show({
 			title: 'hezhuopeng'
 		}).then(function(res) {
 			console.log(res)
 		})
 	}

 }])

 app.factory('MyToast', ['$q','$rootScope','$compile','$timeout', function($q, $rootScope, $compile, $timeout){
 	
 	// ----- 模板放在内存 ? --------
 	var html = html? html : mkHTML();
 	// ----- 其中变量 --------
 	var $ = angular.element;
 	var _body = $(document.querySelector('body'))
 	

 	function mkHTML() {
 		// ---- 生成公用模板 ------
 		return [
 		"<div ng-style='bg' ng-class='{bg: true}' ng-click='close2()' ></div>",
 			"<div ng-class='{toast: true, hide: !BIRTH}'>",
 				"<p ng-class='{closeBtn: true}' ng-click='test()'>sayHi</p>",
 				"<p ng-class='{showText:true}'>{{title}}</p>",
 				"<p><input type='text' ng-model='res' /></p>",
 				"<p ng-class='{closeBtn: true}' ng-click='close()'>X</p>",
 			"</div>"
 		].join('')
 	}

 	function mkModel(option) {
 		// ---- 这应该是一个构造函数 -----
 		// ---- 作用域 -------
 		this.scope = $rootScope.$new()
 		var _s = this.scope
 		// ---- 相关变量 ------
 		_s.res = null;
 		_s.html = $(html);
 		_s.BIRTH = false;
 		_s.DESTROY = false;
 		_s.defer = $q.defer()
 		_s.promise = _s.defer.promise;
 		// ---- 相关样式 -----
 		var win_h = document.documentElement.clientHeight;
		var win_w = document.body ? document.body.clientWidth  : document.documentElement.clientWidth ;
 		_s.bg = {
 			'height': win_h + 'px',
 			'width':  win_w+ 'px'
 		}
 		// ---- 相关函数 ------
 		_s.test = function() {
 			console.log(_s.title)
 		}
 		_s.close = function() {
 			_s.BIRTH = false;
 			// ---- promise return ----
 			_s.defer.resolve(_s.res)
 			$timeout(function(){
 				_s.html.remove();
 				_s.$destroy()
 			}, 400)
 		}
 		_s.close2 = function() {
 			_s.BIRTH = false;
 			// ---- promise return ----
 			_s.defer.resolve()
 			$timeout(function(){
 				_s.html.remove();
 				_s.$destroy()
 			}, 400)
 		}
 		// ---- 关联option ------
 		_s.title = option ? option.title : null;
 		// ------- $compile --------
 		$compile(_s.html)(_s)
 		// ----- 生命周期函数1：插入body后执行回调/动画 --------
 		_s.unwatchBIRTH = _s.$watch('BIRTH', function(newV, oldV){
 			if(newV){
 				// ....
 			}
 		})
 		// ----- 生命周期函数2: 移除Dom后执行回调/维护队列、scope、html ----------
 		_s.unwatchDESTROY= _s.$watch('DESTROY', function(newV, oldV){
 			if(newV){
 				// ....
 				
 			}
 		})

 		// ---- start ----
 		_body.append(_s.html);
 		$timeout(function(){
 			_s.BIRTH = true
 		}, 16)
 	}

 	function show(option) {
 		var a = new mkModel(option)
 		return a.scope.promise
 	}

 	return {
 		show: show
 	}
 }])

