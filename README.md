ngScroll
========

Angular module for handling scroll events in your angular js applications. Some of goals of this project worth noting include:

* Be lightweight, flexible and easy to use
* Only bind scroll event handler one time
* Throttle scroll events

#Usage
ngScroll is composed of one factory and one directive. The factory can be injected into any controller, service, factory, or directive and be used to programatically bind scroll events in your applications. The factory can be injected and used like so:

###Factory: scroll
```javascript
app.directive('someDirective', ['scroll', function(scroll){
  return{
    controller: function($scope){
      $scope.setDimensions = function(data){
        $scope.x = data.x;
        $scope.y = data.y;
      }
    },
    link: function($scope, $element, $attributes, controller){
      scroll.set();
      $scope.$on('scroll', function(event, data){
        $scope.setDimensions(data);
      });
    }
  };
}])
```
####Methods
name | description
---- | ----
<pre>check()</pre> | Check's to see if the scroll event handler has been bound. Returns boolean.
<pre>bind()</pre> | Binds and throttles the scroll event handler to the document - This shouldn't be used to bind events, instead use the `set()` method to bind scroll events programatically.
<pre>set()</pre> | Check's to see if the scroll event handler is bound, if not then it will bind the event to document. Useful one liner to ensure event is bound. Will bind event only one time.
<pre>get()</pre> | Gets the current scroll data. Returns scroll object.
<pre>date()</pre> | Defines `Date.now()` for older browsers.

###Directive: ng-scroll
The directive approach is similar to default angular directives. Something worth noting is that when the scroll event is triggered, the expression is not wrapped in `$apply()`. This approach was taken because scroll events happen frequently (every 30ms) and tests have shown that with many bindings (1000+) the events would be delayed as they had to wait for each digest. The goal is to provide efficient, useful access to scroll events without crippling the ui.

```html
<div ng-scroll="setDimensions($event)"></div>
```

###The Scroll Object
If you use the event object from the directive or the `get()` method from the factory you will receive an object with some scroll related properties and values.

key | description
--- | ---
x | Current scroll position along the X axis
y | Current scroll position along the Y axis
type | Event type
timestamp | Timestamp when the event occured
timelapse | Amount of time that has passed since the last scroll event
distanceX | How far we have traveled along the X axis since the last scroll
distanceY | How far we have traveled along the Y axis since the last scroll
velocityX | Velocity of the scroll along X axis (distance / time)
velocityY | Velocity of the scroll along Y axis (distance / time)
directionX | Direction we are travelling along the X axis (left or right)
directionY | Direction we are travelling along the Y axis (up or down)
scrollHeight | Scrollable height of the page
event | Original event object
