# angular-component-practices
### 这是我对angular1.x做可复用性组件的一些思考
### 我认为做组件的时候应该根据组件的表现(ui)、是否要具备并发性、复用性、与调用者作用域之间的交互来设计组件
### 同时，应该充分利用angular的good part -- 数据驱动、作用域绑定
##### 组件类型1：纯函数功能，而没有视图部分，即Factory(类似于$http)
*  promise.component.html
*  常见的有内置的$http，$q之类的。一般使用promise与作用域进行交互

##### 组件类型2：不是常驻于视图，而是动态插入的、有UI的一类组件，有输入交互、不常被调用(类似于Model对话框)
* factory.component.html
* 并发性。这里收到es6的启发。在factory内使用了构造函数，来区分不同的实例。当然，factory接口返回的类型要根据需求来定：仅仅是一个promise?还是返回一整个组件的实例
* 数据驱动。factory内部我使用了this.scope = $rootScope.$new()。并把每个实例的模板和作用域进行绑定$compile(html())(scope)。感谢毛总，这招真是方便。我们能够真正使用到angular的精髓：用数据来驱动我们的视图了
* 交互。该demo因为需要与用户进行交互，因此返回了一个promise给调用者。当然实际要看情况。
* 作用域。由于该组件并不常常需要被调用，因此一旦组件'close'(从视图上消失)，就scope.$destroy()、instance.remove()

##### 组件类型3：不常驻于视图，但会被经常调用，而且是动态插入的、无输入交互、有UI的一类组件(类似于popover)
* factory.component2.html
* 对比。与上类型组件对比，该类组件更容易被调用(类似于微信右上角的popover)
* 并发性。要求更高，稍复杂。因此返回组件的实例，让开发者可用调用组件内部的方法(open/close/...)。同时，鉴于需求特殊性，在open()方法处我传入了$event作为UI参数
* 作用域。由于是隐藏地常驻与视图，因此只当路由切换时才注销实例。scope.$watch('$stateChangeSuccess', function(){scope.destroy()})
* 组件实例。赋值给作用域的变量 $scope.instance = Mypop.init()

##### 组件类型4：实例之间存在某种关系、不常驻于视图，动态插入、只有视觉交互、有UI的一类组件(类似于ant design的Notification)
* factory.component.3.html
* 对比。与上类组件对比，组件的每个实例之间需要存在某种队列关系，具体操作方法请参考上面的例子。
* 实例关系。如何维护实例之间的关系？笔者比较笨的方法是开启另一个factory实例，存放一个实例数据，来维护实例之间的关系var _sl = scope.list = []。然后该factory具备操作实例队列的一些方法 _sl.push(token)或者 _sl.shift()。同时每个实例都会监听这个实例队列 _s.$watchCollection('instanceList', function(){...})
