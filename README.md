# angular-component-practices
### 这是我对angular1.x做可复用性组件的一些思考
### 我认为做组件的时候应该根据组件的表现(ui)、是否要具备并发性、复用性、与调用者作用域之间的交互来设计组件
### 同时，应该充分利用angular的good part -- 数据驱动、作用域绑定
##### 组件类型1：纯函数功能，而没有视图部分，即Factory
*  promise.component.html
*  常见的有内置的$http，$q之类的。一般使用promise与作用域进行交互

##### 组件类型2：不是常驻于视图，而是动态插入的、有UI的一类组件
* factory.component.html
* 并发性。这里收到es6的启发。在factory内使用了构造函数，来区分不同的实例。当然，factory接口返回的类型要根据需求来定：仅仅是一个promise?还是返回一整个组件的实例
* 数据驱动。factory内部我使用了this.scope = $rootScope.$new()。并把每个实例的模板和作用域进行绑定$compile(html())(scope)。感谢毛总，这招真是方便。我们能够真正使用到angular的精髓：用数据来驱动我们的视图了
* 交互。该demo返回了一个promise给调用者。当然实际要看情况。
